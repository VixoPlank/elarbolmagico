import { BaseCommand, args } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestHash extends BaseCommand {
  static commandName = 'test:hash'
  static description = 'Genera un hash scrypt para el texto proporcionado'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'El texto al que se le aplicará el hash' })
  declare text: string

  async run() {
    this.logger.info(`Generando hash para: "${this.text}"`)

    try {
      const hashedValue = await hash.make(this.text)
      this.logger.success(`Hash generado con éxito:`)
      this.logger.log(this.colors.green(hashedValue))
    } catch (error) {
      this.logger.error(`Error al generar el hash: ${error.message}`)
    }
  }
}
