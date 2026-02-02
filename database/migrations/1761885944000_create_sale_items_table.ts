import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sale_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('sale_id').notNullable()
      table.foreign('sale_id').references('id').inTable('sales').onDelete('CASCADE')
      table.uuid('product_id').notNullable()
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
      table.integer('quantity').notNullable()
      table.integer('price').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
