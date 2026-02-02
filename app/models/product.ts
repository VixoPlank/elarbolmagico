import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import Brand from './brand.js'
import Topic from './topic.js'
import Publisher from './publisher.js'
import Author from './author.js'
import User from './user.js'
import StockMovement from './stock_movement.js'
import SaleItem from './sale_item.js'
import { ProductType } from '#enums/product'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare barCode: string

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare img: string | null

  @column()
  declare normalizedName: string | null

  @column()
  declare lowStockAlert: boolean

  @column()
  declare type: ProductType

  @column()
  declare categoryId: string | null

  @column()
  declare brandId: string | null

  @column()
  declare topicId: string | null

  @column()
  declare publisherId: string | null

  @column()
  declare authorId: string | null

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Brand, {
    foreignKey: 'brandId',
  })
  declare brand: BelongsTo<typeof Brand>

  @belongsTo(() => Topic, {
    foreignKey: 'topicId',
  })
  declare topic: BelongsTo<typeof Topic>

  @belongsTo(() => Publisher, {
    foreignKey: 'publisherId',
  })
  declare publisher: BelongsTo<typeof Publisher>

  @belongsTo(() => Author, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof Author>

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => StockMovement, {
    foreignKey: 'productId',
  })
  declare stockMovements: HasMany<typeof StockMovement>

  @hasMany(() => SaleItem, {
    foreignKey: 'productId',
  })
  declare saleItems: HasMany<typeof SaleItem>
}
