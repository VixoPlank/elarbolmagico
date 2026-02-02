import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasMany, column } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Sale from './sale.js'
import StockMovement from './stock_movement.js'
import { Role } from '#enums/role'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @column()
  declare role: Role

  static get computed() {
    return ['initials', 'fullName']
  }

  @hasMany(() => Product, {
    foreignKey: 'createdBy',
  })
  declare products: HasMany<typeof Product>

  @hasMany(() => Sale, {
    foreignKey: 'sellerId',
  })
  declare sales: HasMany<typeof Sale>

  @hasMany(() => StockMovement, {
    foreignKey: 'performedBy',
  })
  declare stockMovements: HasMany<typeof StockMovement>

  get initials() {
    if (this.firstName && this.lastName) {
      return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
    }
    return `${this.email.charAt(0)}${this.email.charAt(1)}`.toUpperCase()
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
