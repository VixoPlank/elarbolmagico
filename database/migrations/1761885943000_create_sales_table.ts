import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.integer('total').notNullable()
      table.enum('payment', ['CASH', 'CARD']).notNullable()
      table.uuid('seller_id').notNullable()
      table.foreign('seller_id').references('id').inTable('users').onDelete('CASCADE')
      table.bigInteger('receipt_number').notNullable().unique()
      table.timestamp('created_at').notNullable()
    })

    // Crear secuencia para receipt_number
    this.schema.raw("CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1")
    this.schema.raw(
      "ALTER TABLE sales ALTER COLUMN receipt_number SET DEFAULT nextval('receipt_number_seq')"
    )
  }

  async down() {
    this.schema.raw("DROP SEQUENCE IF EXISTS receipt_number_seq")
    this.schema.dropTable(this.tableName)
  }
}
