import vine from '@vinejs/vine'
import { ProductType } from '#enums/product'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    barCode: vine.string().trim().maxLength(100).unique({ table: 'products', column: 'bar_code' }),
    price: vine.number().decimal(0).min(0),
    stock: vine.number().decimal(0).min(0),
    type: vine.enum(ProductType),
    categoryId: vine.string().trim().optional(),
    brandId: vine.string().trim().optional(),
    topicId: vine.string().trim().optional(),
    publisherId: vine.string().trim().optional(),
    authorId: vine.string().trim().optional(),
    img: vine.string().trim().optional(),
    lowStockAlert: vine.boolean().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    barCode: vine.string().trim().maxLength(100).optional(),
    price: vine.number().decimal(0).min(0).optional(),
    stock: vine.number().decimal(0).optional(),
    categoryId: vine.string().trim().optional(),
    brandId: vine.string().trim().optional(),
    topicId: vine.string().trim().optional(),
    publisherId: vine.string().trim().optional(),
    authorId: vine.string().trim().optional(),
    img: vine.string().trim().optional(),
    lowStockAlert: vine.boolean().optional(),
  })
)

export const adjustStockValidator = vine.compile(
  vine.object({
    stock: vine.number().decimal(0),
    reason: vine.string().trim().optional(),
  })
)
