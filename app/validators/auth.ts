import vine from '@vinejs/vine'

export const loginValidator = vine.create({
  email: vine.string().email().normalizeEmail(),
  password: vine.string(),
})

export const registerValidator = vine.create({
  firstName: vine.string().trim().minLength(1).maxLength(255),
  lastName: vine.string().trim().minLength(1).maxLength(255),
  email: vine
    .string()
    .email()
    .normalizeEmail()
    .maxLength(255)
    .unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(8).maxLength(255).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const updatePasswordValidator = vine.create({
  currentPassword: vine.string(),
  password: vine.string().minLength(8).maxLength(255).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
