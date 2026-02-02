import { BaseSeeder } from '@adonisjs/lucid/seeders'
import OwnerSeeder from './owner_seeder.js'

export default class DatabaseSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    console.log('🌱 Starting database seeding...')

    try {
      // Run owner seeder
      console.log('Running OwnerSeeder...')
      const ownerSeeder = new OwnerSeeder(this.client)
      await ownerSeeder.run()

      console.log('✅ Database seeding completed successfully!')
    } catch (error) {
      console.error('❌ Database seeding failed:', error)
      throw error
    }
  }
}
