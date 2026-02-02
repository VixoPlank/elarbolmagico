import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import User from './user.js'

import { StockMovementType } from '#enums/stock_movement'

export default class StockMovement extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare productId: string

  @column()
  declare type: StockMovementType

  @column()
  declare quantity: number

  @column()
  declare reason: string | null

  @column()
  declare performedBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => User, {
    foreignKey: 'performedBy',
  })
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignUuid(movement: StockMovement) {
    movement.id = randomUUID()
  }
}
