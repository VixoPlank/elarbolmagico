# Rehash Passwords Command

## 🔐 ¿Por qué es necesario?

Cuando migras de **Supabase a AdonisJS**, las contraseñas están hasheadas con diferentes algoritmos:

- **Supabase**: Usa `bcrypt` (Supabase Auth)
- **AdonisJS**: Usa `scrypt` (por defecto)

Las contraseñas de Supabase **NO funcionarán** en AdonisJS sin rehashearlas.

## 🚀 Uso

### Después de cargar el dump:

```bash
# Local
node ace rehash:passwords

# Producción (Dokploy)
docker exec -it <nombre-contenedor-app> node ace rehash:passwords
```

## ⚙️ ¿Qué hace el comando?

1. ✅ Obtiene todos los usuarios de la base de datos
2. ✅ Detecta si la contraseña ya está en formato `scrypt`
3. ✅ Si NO está en scrypt, la rehashea con una contraseña temporal
4. ✅ Muestra un resumen de usuarios actualizados

## 🔑 Contraseña Temporal

Todos los usuarios rehasheados tendrán la contraseña temporal:

```
ChangeMe123!
```

**Los usuarios deberán cambiar su contraseña en el primer login.**

## 📋 Ejemplo de Output

```
🔐 Iniciando rehash de contraseñas...
📊 Encontrados 15 usuarios

✅ Usuario admin@example.com - contraseña rehasheada
✅ Usuario user1@example.com - contraseña rehasheada
⏭️  Usuario user2@example.com ya tiene hash scrypt, omitiendo...
✅ Usuario user3@example.com - contraseña rehasheada

🎉 Proceso completado:
   - Actualizados: 12
   - Omitidos: 3
   - Total: 15

⚠️  IMPORTANTE: Todos los usuarios actualizados tienen la contraseña temporal: "ChangeMe123!"
   Los usuarios deberán cambiar su contraseña en el primer login.
```

## 🔄 Alternativa: Soporte Multi-Driver

Si prefieres **mantener las contraseñas originales de Supabase**, puedes configurar AdonisJS para soportar múltiples drivers de hash:

### 1. Instalar bcrypt

```bash
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

### 2. Actualizar `config/hash.ts`

```typescript
import { defineConfig, drivers } from '@adonisjs/core/hash'
import { Bcrypt } from '@adonisjs/core/hash/drivers/bcrypt'

const hashConfig = defineConfig({
  default: 'scrypt',

  list: {
    scrypt: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }),

    // Agregar bcrypt para compatibilidad con Supabase
    bcrypt: drivers.bcrypt({
      rounds: 10,
    }),
  },
})

export default hashConfig
```

### 3. AdonisJS detectará automáticamente el driver

Cuando un usuario intente hacer login, AdonisJS:

1. Detectará que la contraseña está en formato bcrypt
2. La verificará usando el driver bcrypt
3. Opcionalmente, la puede rehashear a scrypt automáticamente

## ⚠️ Consideraciones de Seguridad

1. **Contraseña temporal fuerte**: `ChangeMe123!` cumple con requisitos básicos
2. **Forzar cambio de contraseña**: Implementa lógica para forzar cambio en primer login
3. **Notificar usuarios**: Envía emails notificando el cambio
4. **Logs de auditoría**: El comando muestra qué usuarios fueron actualizados

## 📚 Recursos

- [AdonisJS Hash Documentation](https://docs.adonisjs.com/guides/security/hashing)
- [Scrypt vs Bcrypt](https://blog.logrocket.com/password-hashing-node-js-bcrypt-argon2-scrypt/)
