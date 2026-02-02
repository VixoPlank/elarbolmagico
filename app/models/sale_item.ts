import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sale from './sale.js'
import Product from './product.js'

export default class SaleItem extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare saleId: string

  @column()
  declare productId: string

  @column()
  declare quantity: number

  @column()
  declare price: number

  @belongsTo(() => Sale, {
    foreignKey: 'saleId',
  })
  declare sale: BelongsTo<typeof Sale>

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  @beforeCreate()
  public static assignUuid(saleItem: SaleItem) {
    saleItem.id = randomUUID()
  }
}
