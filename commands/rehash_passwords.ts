import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class RehashPasswords extends BaseCommand {
  static commandName = 'rehash:passwords'
  static description = 'Rehashea las contraseñas de los usuarios después de migrar desde Supabase'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔐 Iniciando rehash de contraseñas...')

    // Contraseña temporal por defecto
    const defaultPassword = 'ChangeMe123!'

    try {
      // Obtener todos los usuarios
      const users = await User.all()

      this.logger.info(`📊 Encontrados ${users.length} usuarios`)

      let updated = 0
      let skipped = 0

      for (const user of users) {
        try {
          // Verificar si la contraseña ya está en formato scrypt de AdonisJS
          // Las contraseñas de scrypt empiezan con un formato específico
          const isAlreadyScrypt = user.password.startsWith('scrypt:')

          if (isAlreadyScrypt) {
            this.logger.info(`⏭️  Usuario ${user.email} ya tiene hash scrypt, omitiendo...`)
            skipped++
            continue
          }

          // Rehashear con la contraseña temporal
          user.password = await hash.make(defaultPassword)
          await user.save()

          this.logger.success(`✅ Usuario ${user.email} - contraseña rehasheada`)
          updated++
        } catch (error) {
          this.logger.error(`❌ Error al procesar usuario ${user.email}: ${error.message}`)
        }
      }

      this.logger.info('')
      this.logger.success(`🎉 Proceso completado:`)
      this.logger.info(`   - Actualizados: ${updated}`)
      this.logger.info(`   - Omitidos: ${skipped}`)
      this.logger.info(`   - Total: ${users.length}`)
      this.logger.info('')
      this.logger.warning(
        `⚠️  IMPORTANTE: Todos los usuarios actualizados tienen la contraseña temporal: "${defaultPassword}"`
      )
      this.logger.warning(`   Los usuarios deberán cambiar su contraseña en el primer login.`)
    } catch (error) {
      this.logger.error(`❌ Error: ${error.message}`)
      this.exitCode = 1
    }
  }
}
