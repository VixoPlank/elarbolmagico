import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class PrismaMigrationSchema extends BaseModel {
  static $columns = ['id', 'checksum', 'finishedAt', 'migrationName', 'logs', 'rolledBackAt', 'startedAt', 'appliedStepsCount'] as const
  $columns = PrismaMigrationSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare checksum: string
  @column.dateTime()
  declare finishedAt: DateTime | null
  @column()
  declare migrationName: string
  @column()
  declare logs: string | null
  @column.dateTime()
  declare rolledBackAt: DateTime | null
  @column.dateTime()
  declare startedAt: DateTime
  @column()
  declare appliedStepsCount: number
}

export class AuthorSchema extends BaseModel {
  static $columns = ['id', 'name', 'createdAt', 'bio', 'country', 'img', 'normalizedName'] as const
  $columns = AuthorSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare name: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare bio: string | null
  @column()
  declare country: string
  @column()
  declare img: string | null
  @column()
  declare normalizedName: string
}

export class BrandSchema extends BaseModel {
  static $columns = ['id', 'name', 'createdAt'] as const
  $columns = BrandSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare name: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class CategorySchema extends BaseModel {
  static $columns = ['id', 'name', 'createdAt'] as const
  $columns = CategorySchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare name: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class ProductSchema extends BaseModel {
  static $columns = ['id', 'name', 'barCode', 'price', 'stock', 'createdAt', 'updatedAt', 'categoryId', 'publisherId', 'createdBy', 'authorId', 'topicId', 'img', 'brandId', 'type', 'lowStockAlert', 'normalizedName'] as const
  $columns = ProductSchema.$columns
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
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column()
  declare categoryId: string | null
  @column()
  declare publisherId: string | null
  @column()
  declare createdBy: string | null
  @column()
  declare authorId: string | null
  @column()
  declare topicId: string | null
  @column()
  declare img: string | null
  @column()
  declare brandId: string | null
  @column()
  declare type: any
  @column()
  declare lowStockAlert: boolean
  @column()
  declare normalizedName: string | null
}

export class PublisherSchema extends BaseModel {
  static $columns = ['id', 'name', 'createdAt'] as const
  $columns = PublisherSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare name: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class SaleItemSchema extends BaseModel {
  static $columns = ['id', 'saleId', 'productId', 'quantity', 'price'] as const
  $columns = SaleItemSchema.$columns
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
}

export class SaleSchema extends BaseModel {
  static $columns = ['id', 'total', 'createdAt', 'sellerId', 'payment', 'receiptNumber'] as const
  $columns = SaleSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare total: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare sellerId: string
  @column()
  declare payment: any
  @column()
  declare receiptNumber: bigint | number
}

export class StockMovementSchema extends BaseModel {
  static $columns = ['id', 'productId', 'type', 'quantity', 'reason', 'createdAt', 'performedBy'] as const
  $columns = StockMovementSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare productId: string
  @column()
  declare type: any
  @column()
  declare quantity: number
  @column()
  declare reason: string | null
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare performedBy: string
}

export class TopicSchema extends BaseModel {
  static $columns = ['id', 'name', 'createdAt'] as const
  $columns = TopicSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare name: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class UserSchema extends BaseModel {
  static $columns = ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'createdAt', 'isActive'] as const
  $columns = UserSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare firstName: string
  @column()
  declare lastName: string
  @column()
  declare email: string
  @column({ serializeAs: null })
  declare password: string
  @column()
  declare role: any
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare isActive: boolean
}
