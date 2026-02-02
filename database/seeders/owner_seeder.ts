import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { Role } from '#enums/role'

export default class OwnerSeeder extends BaseSeeder {
  async run() {
    console.log('🌱 Starting owner seeder...')

    await User.updateOrCreate(
      { email: 'owner@example.com' },
      {
        firstName: 'Owner',
        lastName: 'System',
        email: 'owner@example.com',
        password: 'password',
        role: Role.OWNER,
        isActive: true,
      }
    )

    console.log('✅ Owner user seeded successfully')
  }
}
