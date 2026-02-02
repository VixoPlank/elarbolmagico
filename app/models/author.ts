import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Author extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare normalizedName: string

  @column()
  declare country: string

  @column()
  declare bio: string | null

  @column()
  declare img: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => Product, {
    foreignKey: 'authorId',
  })
  declare products: HasMany<typeof Product>
}
