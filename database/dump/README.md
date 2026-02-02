# Cargar Dump de PostgreSQL

Este directorio contiene el dump de la base de datos PostgreSQL y el script necesario para cargarlo.

## 📁 Archivos

- `postgres.dump` - Archivo dump de PostgreSQL (formato SQL texto) ⚠️ **NO incluir en Git**
- `load_dump.sh` - Script Bash para cargar el dump (Linux/Mac/Git Bash/Dokploy)
- `README.md` - Este archivo

## ⚠️ IMPORTANTE - Seguridad

**Los archivos `.dump` y `.sql` contienen datos sensibles** (usuarios, passwords hasheados, datos de producción, etc.) y **NUNCA deben ser incluidos en el repositorio Git**.

✅ **Ya están en `.gitignore`** - Asegúrate de que permanezcan ahí  
✅ **Después de migrar a producción** - Puedes eliminar el dump local de forma segura  
✅ **Para backups** - Usa soluciones seguras (encriptación, almacenamiento privado)

## 🚀 Cómo cargar el dump

### Opción 1: Usando el script automatizado (Recomendado)

```bash
# Desde el directorio database/dump
chmod +x load_dump.sh
./load_dump.sh
```

**Funciona en:**

- ✅ Linux/Mac
- ✅ Git Bash en Windows
- ✅ WSL (Windows Subsystem for Linux)
- ✅ Servidores de producción (Dokploy)

### ✨ Funcionalidad Automática

El script incluye **renombrado automático** de:

**Tablas**: PascalCase → snake_case plural

- `Author` → `authors`
- `Product` → `products`
- `SaleItem` → `sale_items`
- etc.

**Columnas**: camelCase → snake_case

- `createdAt` → `created_at`
- `updatedAt` → `updated_at`
- `userId` → `user_id`
- etc.

### Opción 2: Manualmente con Docker

1. **Asegúrate de que Docker Compose está corriendo:**

```bash
docker compose up -d postgres
```

2. **Encuentra el nombre del contenedor de PostgreSQL:**

```bash
docker ps | grep postgres
```

3. **Copia el dump al contenedor:**

```bash
docker cp postgres.dump <NOMBRE_CONTENEDOR>:/tmp/postgres.dump
```

4. **Restaura el dump usando psql:**

```bash
docker exec -e PGPASSWORD=postgres <NOMBRE_CONTENEDOR> psql -h localhost -U postgres -d elarbolmagico -f /tmp/postgres.dump
```

5. **Limpia el archivo temporal:**

```bash
docker exec <NOMBRE_CONTENEDOR> rm /tmp/postgres.dump
```

## ⚙️ Configuración

El script utiliza las variables de entorno del archivo `.env` en la raíz del proyecto:

- `DB_HOST` - Host de la base de datos (default: localhost)
- `DB_PORT` - Puerto de PostgreSQL (default: 5432)
- `DB_USER` - Usuario de PostgreSQL (default: postgres)
- `DB_PASSWORD` - Contraseña de PostgreSQL (default: postgres)
- `DB_DATABASE` - Nombre de la base de datos (default: elarbolmagico)

## 🔍 Verificar que los datos se cargaron

Después de cargar el dump, puedes verificar los datos conectándote a la base de datos:

```bash
# Conectarse a la base de datos
docker exec -it <NOMBRE_CONTENEDOR> psql -U postgres -d elarbolmagico

# Ver las tablas
\dt

# Ver datos de una tabla específica
SELECT * FROM users LIMIT 10;

# Salir
\q
```

## ⚠️ Notas importantes

1. **Formato del dump**: Este dump está en formato SQL texto (plain SQL), por eso usamos `psql` en lugar de `pg_restore`.

2. **Renombrado automático**: El script renombra automáticamente las tablas y columnas al formato del proyecto (snake_case).

3. **Errores normales**: Es normal ver algunos errores/warnings durante la restauración, especialmente relacionados con:
   - Roles/usuarios que no existen
   - Extensiones que ya están instaladas
   - Permisos y propietarios
   - **Estos errores NO afectan la carga de los datos**

4. **Tiempo de carga**: Dependiendo del tamaño del dump, la carga puede tomar desde unos segundos hasta varios minutos.

5. **Primera vez**: Si es la primera vez que cargas el dump, asegúrate de que la base de datos existe. El script la crea automáticamente si no existe.

## 🔧 Solución de problemas

### Error: "database does not exist"

El script debería crear la base de datos automáticamente, pero si falla:

```bash
# Crear la base de datos manualmente
docker exec -it <NOMBRE_CONTENEDOR> psql -U postgres -c "CREATE DATABASE elarbolmagico;"
```

### Error: "Docker no está corriendo"

```bash
# Iniciar Docker Desktop o el servicio de Docker
```

### Error: "permission denied" (Linux/Mac)

```bash
# Dar permisos de ejecución al script
chmod +x load_dump.sh
```

### Error: "role ... does not exist"

Estos errores son **normales** y **no afectan** la carga de datos. El dump incluye comandos para roles que no existen en tu instalación local de PostgreSQL, pero los datos se cargan correctamente de todas formas.

### Error: "duplicate key value violates unique constraint"

Este error aparece cuando intentas cargar el dump en una base de datos que ya tiene datos. El script limpia la base de datos antes de cargar, pero si ves este error, significa que algunos datos ya existían.

## 📊 Contenido del dump

El dump incluye las siguientes tablas principales:

- `users` - Usuarios del sistema
- `products` - Productos
- `categories` - Categorías
- `authors` - Autores
- `publishers` - Editoriales
- `brands` - Marcas
- `topics` - Temas/Tópicos
- `sales` - Ventas
- `sale_items` - Items de venta
- `stock_movements` - Movimientos de stock
- `product_authors` - Relación productos-autores
- `product_topics` - Relación productos-tópicos
- Y más...

## 🎯 Flujo del script

1. ✅ Verifica que Docker esté corriendo
2. ✅ Encuentra el contenedor de PostgreSQL (o lo inicia)
3. ✅ Limpia la base de datos (DROP SCHEMA public CASCADE)
4. ✅ Copia el dump al contenedor
5. ✅ Ejecuta el dump SQL
6. ✅ **Renombra automáticamente las tablas de PascalCase a snake_case plural**
7. ✅ **Renombra automáticamente las columnas de camelCase a snake_case**
8. ✅ Limpia archivos temporales
9. ✅ Muestra resumen

## 🚀 Para Producción (Dokploy)

Ver la guía completa en `docs/MIGRATION_DOKPLOY.md` para instrucciones detalladas de cómo usar este script en producción.

## 📚 Recursos adicionales

- [Documentación de psql](https://www.postgresql.org/docs/current/app-psql.html)
- [Documentación de pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Guía de Migración a Dokploy](../docs/MIGRATION_DOKPLOY.md)
