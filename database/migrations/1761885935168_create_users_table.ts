import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.enum('role', ['SUPER_ADMIN', 'OWNER', 'EMPLOYEE', 'USER']).notNullable().defaultTo('USER')
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
