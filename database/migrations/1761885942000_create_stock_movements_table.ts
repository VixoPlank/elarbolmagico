import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('product_id').notNullable()
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
      table.enum('type', ['IN', 'OUT', 'ADJUSTMENT']).notNullable()
      table.integer('quantity').notNullable()
      table.text('reason').nullable()
      table.uuid('performed_by').notNullable()
      table.foreign('performed_by').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
