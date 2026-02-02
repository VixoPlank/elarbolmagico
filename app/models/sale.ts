import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import SaleItem from './sale_item.js'
import { PaymentMethodType } from '#enums/payment_method'

export default class Sale extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare total: number

  @column()
  declare payment: PaymentMethodType

  @column()
  declare sellerId: string

  @column()
  declare receiptNumber: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'sellerId',
  })
  declare seller: BelongsTo<typeof User>

  @hasMany(() => SaleItem, {
    foreignKey: 'saleId',
  })
  declare items: HasMany<typeof SaleItem>

  @beforeCreate()
  public static assignUuid(sale: Sale) {
    sale.id = randomUUID()
  }
}
