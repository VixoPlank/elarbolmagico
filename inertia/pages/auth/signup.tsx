import { Head, useForm } from '@inertiajs/react'
import { LoaderCircle } from 'lucide-react'
import { FormEventHandler } from 'react'
import { Toaster } from 'sonner'

import { useFlashToast } from '@/hooks/use-flash-toast'
import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { urlFor } from '@/client'

type RegisterForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
}

export default function Signup() {
  useFlashToast()

  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post(urlFor('register.store'), {
      onFinish: () => reset('password', 'passwordConfirmation'),
    })
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Toaster position="top-right" richColors />
      <Head title="Registro" />
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Crear una cuenta</h1>
                  <p className="text-muted-foreground text-balance">
                    Ingresa tus datos para crear tu cuenta
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    autoFocus
                    autoComplete="given-name"
                    value={data.firstName}
                    onChange={(e) => setData('firstName', e.target.value)}
                    disabled={processing}
                    placeholder="Nombre"
                  />
                  <InputError message={errors.firstName} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={data.lastName}
                    onChange={(e) => setData('lastName', e.target.value)}
                    disabled={processing}
                    placeholder="Apellido"
                  />
                  <InputError message={errors.lastName} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="ejemplo@correo.com"
                  />
                  <InputError message={errors.email} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    disabled={processing}
                    placeholder="Contraseña"
                  />
                  <InputError message={errors.password} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="passwordConfirmation">Confirmar contraseña</FieldLabel>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.passwordConfirmation}
                    onChange={(e) => setData('passwordConfirmation', e.target.value)}
                    disabled={processing}
                    placeholder="Confirmar contraseña"
                  />
                  <InputError message={errors.passwordConfirmation} />
                </Field>

                <Field>
                  <Button type="submit" disabled={processing} className="w-full">
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Crear cuenta
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  ¿Ya tienes una cuenta?{' '}
                  <TextLink href={urlFor('login.show')}>Iniciar sesión</TextLink>
                </FieldDescription>
              </FieldGroup>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Registro"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="mt-4 px-6 text-center">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
        </FieldDescription>
      </div>
    </div>
  )
}
