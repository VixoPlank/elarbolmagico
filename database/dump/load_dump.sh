#!/bin/bash

# Script para cargar el dump de PostgreSQL
# Uso: ./load_dump.sh

set -e

echo "🔄 Cargando dump de PostgreSQL..."

# Cargar variables de entorno
if [ -f "../../.env" ]; then
    export $(cat ../../.env | grep -v '^#' | xargs)
else
    echo "❌ Error: Archivo .env no encontrado"
    exit 1
fi

# Configuración de la base de datos
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_DATABASE=${DB_DATABASE:-app}
DUMP_FILE="postgres.dump"

# Verificar que el archivo dump existe
if [ ! -f "$DUMP_FILE" ]; then
    echo "❌ Error: El archivo $DUMP_FILE no existe"
    exit 1
fi

echo "📊 Configuración:"
echo "  Host: $DB_HOST"
echo "  Puerto: $DB_PORT"
echo "  Usuario: $DB_USER"
echo "  Base de datos: $DB_DATABASE"
echo ""

# Verificar si Docker está corriendo
if ! docker ps &> /dev/null; then
    echo "❌ Error: Docker no está corriendo o no tienes permisos"
    exit 1
fi

# Verificar si el contenedor de PostgreSQL está corriendo
POSTGRES_CONTAINER=$(docker ps --filter "ancestor=postgres:latest" --format "{{.Names}}" | head -n 1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "⚠️  El contenedor de PostgreSQL no está corriendo"
    echo "🚀 Iniciando servicios con Docker Compose..."
    cd ../..
    docker compose up -d postgres
    cd database/dump
    
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 10
    
    POSTGRES_CONTAINER=$(docker ps --filter "ancestor=postgres:latest" --format "{{.Names}}" | head -n 1)
fi

echo "✅ Contenedor PostgreSQL encontrado: $POSTGRES_CONTAINER"
echo ""

# Restaurar usando psql (el dump es formato SQL texto, no custom)
echo "🧹 Limpiando base de datos (eliminando tablas existentes)..."
MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
    psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $DB_USER; GRANT ALL ON SCHEMA public TO public;" > /dev/null

echo "🔄 Restaurando base de datos..."
echo "⚠️  Esto puede tomar varios minutos dependiendo del tamaño del dump..."
echo ""

# Copiar el dump al contenedor
docker cp "$DUMP_FILE" "$POSTGRES_CONTAINER:/tmp/postgres.dump"

# Ejecutar psql dentro del contenedor
# MSYS_NO_PATHCONV=1 evita que Git Bash en Windows convierta rutas de Linux
echo "📝 Ejecutando SQL dump..."
MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
    psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" \
    -f /tmp/postgres.dump 2>&1 | grep -E "^(ERROR|COPY|CREATE|ALTER|SET)" || true

RESTORE_EXIT_CODE=${PIPESTATUS[0]}

if [ $RESTORE_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ ¡Dump cargado exitosamente!"
else
    echo ""
    echo "⚠️  Hubo algunos errores durante la restauración (código: $RESTORE_EXIT_CODE)"
    echo "ℹ️  Esto es normal si algunas tablas ya existían"
fi

# Renombrar tablas de PascalCase a snake_case plural
echo ""
echo "🔄 Renombrando tablas al formato del proyecto (snake_case plural)..."

# Obtener todas las tablas que empiezan con mayúscula (PascalCase)
TABLES=$(MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
    psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" -tAc \
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name ~ '^[A-Z]';")

if [ -z "$TABLES" ]; then
    echo "ℹ️  No se encontraron tablas en PascalCase para renombrar."
else
    for pascal_name in $TABLES; do
        # Convertir PascalCase a snake_case
        # Ejemplo: SaleItem -> sale_item
        snake_name=$(echo "$pascal_name" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
        
        # Pluralizar (reglas básicas)
        if [[ $snake_name == *y ]]; then
            # category -> categories
            snake_name="${snake_name%y}ies"
        elif [[ ! $snake_name == *s ]]; then
            # product -> products
            snake_name="${snake_name}s"
        fi
        
        echo "  ➜ Renombrando $pascal_name → $snake_name"
        
        # Renombrar la tabla
        MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
            psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" -c \
            "ALTER TABLE \"$pascal_name\" RENAME TO \"$snake_name\";" > /dev/null 2>&1
    done
    echo "✅ Tablas renombradas correctamente"
fi

# Renombrar columnas de camelCase a snake_case
echo ""
echo "🔄 Renombrando columnas al formato del proyecto (snake_case)..."

# Obtener todas las tablas en el esquema public (después del posible renombrado anterior)
ALL_TABLES=$(MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
    psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" -tAc \
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")

for table in $ALL_TABLES; do
    # Obtener columnas que tengan alguna mayúscula (camelCase)
    COLUMNS=$(MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
        psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" -tAc \
        "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '$table' AND column_name ~ '[A-Z]';")
    
    if [ ! -z "$COLUMNS" ]; then
        echo "  ➜ Procesando tabla: $table"
        for camel_col in $COLUMNS; do
            # Convertir camelCase a snake_case
            # Ejemplo: createdAt -> created_at
            snake_col=$(echo "$camel_col" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
            
            echo "    • Renombrando col: $camel_col → $snake_col"
            
            # Renombrar la columna
            MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD" "$POSTGRES_CONTAINER" \
                psql -h localhost -U "$DB_USER" -d "$DB_DATABASE" -c \
                "ALTER TABLE \"$table\" RENAME COLUMN \"$camel_col\" TO \"$snake_col\";" > /dev/null 2>&1
        done
    fi
done
echo "✅ Columnas renombradas correctamente"

# Limpiar el archivo temporal del contenedor
MSYS_NO_PATHCONV=1 docker exec "$POSTGRES_CONTAINER" rm /tmp/postgres.dump > /dev/null 2>&1 || true

echo ""
echo "🎉 ¡Proceso completado!"
echo "🔍 Para verificar los datos, puedes conectarte a la base de datos con:"
echo "   docker exec -it $POSTGRES_CONTAINER psql -U $DB_USER -d $DB_DATABASE"
