# Migración de Supabase a PostgreSQL en Dokploy

Este documento explica cómo migrar tu base de datos de Supabase a PostgreSQL corriendo en Dokploy **sin downtime**.

## 📋 Prerequisitos

- ✅ Dump de Supabase descargado (`postgres.dump` en `database/dump/`)
- ✅ Proyecto creado en Dokploy
- ✅ Docker instalado localmente (para pruebas)

## 🎯 Estrategia de Migración

### Migración Sin Downtime (Recomendada)

**Downtime: 0 minutos**

1. Preparar PostgreSQL en Dokploy (en paralelo con Supabase)
2. Cargar dump usando el script existente
3. Probar en staging
4. Cambiar variables de entorno y redeploy (Dokploy hace zero-downtime)
5. Validar
6. Desactivar Supabase

---

## 🚀 Pasos para Migración

### Paso 1: Probar Localmente (Recomendado)

Antes de migrar a producción, prueba localmente:

```bash
cd database/dump

# Cargar el dump en tu PostgreSQL local
./load_dump.sh
```

Esto:

- ✅ Inicia PostgreSQL si no está corriendo
- ✅ Limpia la base de datos actual
- ✅ Carga el dump (`postgres.dump`)
- ✅ Renombra tablas de PascalCase a snake_case plural
- ✅ Renombra columnas de camelCase a snake_case

### Paso 2: Configurar Dokploy

#### 2.1 Crear Proyecto en Dokploy

1. Accede a tu panel de Dokploy
2. Crea un nuevo proyecto: `elarbolmagico`
3. Conecta tu repositorio Git

#### 2.2 Configurar Servicios

Dokploy detectará automáticamente tu `docker-compose.prod.yml`. Incluye:

- ✅ PostgreSQL con health checks
- ✅ Redis
- ✅ MinIO
- ✅ Tu aplicación (app)
- ✅ Worker para jobs

#### 2.3 Configurar Variables de Entorno

En Dokploy, ve a **Settings > Environment Variables** y configura:

```env
# Base de datos
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=elarbolmagico
DB_USER=postgres
DB_PASSWORD=<tu-password-seguro>

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<tu-password-seguro>

# MinIO
MINIO_ROOT_USER=<tu-usuario>
MINIO_ROOT_PASSWORD=<tu-password-seguro>
MINIO_ENDPOINT=http://minio:9000

# App
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=<genera-uno-nuevo>
```

### Paso 3: Cargar el Dump en Dokploy

#### Método Recomendado: Usando el script existente

```bash
# 1. Conectarte al servidor de Dokploy via SSH
ssh usuario@tu-servidor-dokploy

# 2. Subir el dump y script al servidor
scp database/dump/postgres.dump usuario@tu-servidor:/tmp/
scp database/dump/load_dump.sh usuario@tu-servidor:/tmp/

# 3. En el servidor, crear directorio temporal
mkdir -p /tmp/dump
mv /tmp/postgres.dump /tmp/dump/
mv /tmp/load_dump.sh /tmp/dump/

# 4. Crear .env temporal con las credenciales
cd /tmp
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<tu-password>
DB_DATABASE=elarbolmagico
EOF

# 5. Ejecutar el script
cd dump
chmod +x load_dump.sh
./load_dump.sh
```

El script automáticamente:

- Detecta el contenedor de PostgreSQL en Dokploy
- Crea backup de seguridad
- Limpia y carga el dump
- Renombra tablas y columnas al formato correcto

### Paso 4: Rehashear Contraseñas (IMPORTANTE)

⚠️ **Supabase usa bcrypt, AdonisJS usa scrypt** - Las contraseñas necesitan ser rehasheadas.

```bash
# En Dokploy, abre la terminal del contenedor de tu app
docker exec -it <nombre-contenedor-app> node ace rehash:passwords
```

Este comando:

- ✅ Detecta contraseñas en formato bcrypt de Supabase
- ✅ Las rehashea a scrypt de AdonisJS
- ✅ Asigna una contraseña temporal: `ChangeMe123!`
- ✅ Los usuarios deberán cambiar su contraseña en el primer login

**Alternativa:** Si prefieres mantener las contraseñas originales, necesitarás:

1. Agregar soporte para bcrypt en `config/hash.ts`
2. Configurar multi-driver hash en AdonisJS

### Paso 5: Ejecutar Migraciones (si es necesario)

Si tu proyecto tiene migraciones de AdonisJS que no están en el dump:

```bash
# En Dokploy, abre la terminal del contenedor de tu app
docker exec -it <nombre-contenedor-app> node ace migration:run --force
```

### Paso 6: Redeploy en Dokploy

1. En Dokploy, ve a tu proyecto
2. Click en **Deploy**
3. Dokploy hará un **zero-downtime deployment**:
   - Levanta nuevos contenedores con la nueva configuración
   - Espera a que pasen los health checks
   - Redirige el tráfico a los nuevos contenedores
   - Apaga los contenedores antiguos

### Paso 7: Validar

```bash
# Verificar que la app esté corriendo
curl https://tu-dominio.com/health

# Verificar logs
docker logs <nombre-contenedor-app>

# Verificar base de datos
docker exec -it <nombre-contenedor-postgres> psql -U postgres -d elarbolmagico -c "\dt"
```

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real

```bash
# Logs de la aplicación
docker logs -f <nombre-contenedor-app>

# Logs de PostgreSQL
docker logs -f <nombre-contenedor-postgres>
```

### Conectarse a la base de datos

```bash
docker exec -it <nombre-contenedor-postgres> psql -U postgres -d elarbolmagico
```

### Crear backup manual

```bash
docker exec -i <nombre-contenedor-postgres> pg_dump -U postgres -d elarbolmagico > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
docker exec -i <nombre-contenedor-postgres> psql -U postgres -d elarbolmagico < backup.sql
```

---

## 📊 Checklist de Migración

### Pre-Migración

- [ ] Dump de Supabase descargado y validado
- [ ] Proyecto creado en Dokploy
- [ ] Variables de entorno configuradas
- [ ] `docker-compose.prod.yml` revisado
- [ ] Prueba local exitosa

### Durante la Migración

- [ ] Backup de datos actuales (si existen)
- [ ] Dump cargado en PostgreSQL
- [ ] Tablas y columnas renombradas
- [ ] **Contraseñas rehasheadas** (bcrypt → scrypt)
- [ ] Migraciones ejecutadas (si aplica)
- [ ] Health checks pasando

### Post-Migración

- [ ] Aplicación funcionando correctamente
- [ ] Datos verificados
- [ ] Logs sin errores críticos
- [ ] Performance aceptable
- [ ] Backups automáticos configurados

---

## 🆘 Troubleshooting

### Error: "Contenedor de PostgreSQL no encontrado"

```bash
# Listar todos los contenedores
docker ps -a

# Buscar el contenedor de postgres
docker ps | grep postgres
```

### Error: "Permission denied"

```bash
# Dar permisos de ejecución al script
chmod +x load_dump_dokploy.sh
```

### Error: "FATAL: password authentication failed"

Verifica que las variables de entorno en Dokploy coincidan con las del script.

### La aplicación no se conecta a la base de datos

1. Verifica que `DB_HOST=postgres` (nombre del servicio en docker-compose)
2. Verifica que ambos servicios estén en la misma red
3. Revisa los logs: `docker logs <nombre-contenedor-app>`

---

## 🔄 Rollback Plan

Si algo sale mal:

### Opción 1: Volver a Supabase

1. En Dokploy, actualiza las variables de entorno:
   ```env
   DB_HOST=db.tu-proyecto.supabase.co
   DB_PORT=5432
   DB_DATABASE=postgres
   DB_USER=postgres
   DB_PASSWORD=<tu-password-supabase>
   ```
2. Redeploy

### Opción 2: Restaurar Backup

```bash
# Si creaste un backup antes de la migración
docker exec -i <nombre-contenedor-postgres> psql -U postgres -d elarbolmagico < backup.sql
```

---

## 📚 Recursos Adicionales

- [Documentación de Dokploy](https://docs.dokploy.com)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)

---

## ✅ Mejores Prácticas

1. **Siempre haz backups** antes de cualquier migración
2. **Prueba en staging** antes de producción
3. **Monitorea los logs** durante y después de la migración
4. **Configura backups automáticos** en Dokploy
5. **Documenta cualquier cambio** en las variables de entorno
6. **Mantén Supabase activo** por al menos 1 semana después de la migración (como backup)

---

**¿Necesitas ayuda?** Revisa los logs y el troubleshooting. Si el problema persiste, contacta al equipo de desarrollo.
