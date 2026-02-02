import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('bar_code').notNullable().unique()
      table.integer('price').notNullable()
      table.integer('stock').notNullable()
      table.string('img').nullable()
      table.string('normalized_name').nullable()
      table.boolean('low_stock_alert').notNullable().defaultTo(true)
      table.enum('type', ['BOOK', 'OTHER']).notNullable()

      table.uuid('category_id').nullable()
      table.foreign('category_id').references('id').inTable('categories').onDelete('SET NULL')

      table.uuid('brand_id').nullable()
      table.foreign('brand_id').references('id').inTable('brands').onDelete('SET NULL')

      table.uuid('topic_id').nullable()
      table.foreign('topic_id').references('id').inTable('topics').onDelete('SET NULL')

      table.uuid('publisher_id').nullable()
      table.foreign('publisher_id').references('id').inTable('publishers').onDelete('SET NULL')

      table.uuid('author_id').nullable()
      table.foreign('author_id').references('id').inTable('authors').onDelete('SET NULL')

      table.uuid('created_by').nullable()
      table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
