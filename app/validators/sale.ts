import vine from '@vinejs/vine'
import { PaymentMethodType } from '#enums/payment_method'

export const createSaleValidator = vine.compile(
  vine.object({
    paymentMethod: vine.enum(PaymentMethodType),
    items: vine.array(
      vine.object({
        productId: vine.string().uuid(),
        quantity: vine.number().positive(),
        price: vine.number().positive(),
      })
    ),
  })
)
