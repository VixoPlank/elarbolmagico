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

type LoginForm = {
  email: string
  password: string
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
  email?: string | null
  greeting?: boolean
}

export default function Login({ status, canResetPassword, email, greeting }: LoginProps) {
  useFlashToast()

  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: email || '',
    password: '',
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post(urlFor('login.store'), {
      onFinish: () => reset('password'),
    })
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Toaster position="top-right" richColors />
      <Head title={greeting ? 'Bienvenido' : 'Iniciar sesión'} />
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">
                    {greeting ? '¡Bienvenido!' : '¡Bienvenido de nuevo!'}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {greeting
                      ? 'Tu cuenta ha sido creada exitosamente. Ingresa tu contraseña para comenzar.'
                      : 'Inicia sesión en tu cuenta de El Árbol Mágico'}
                  </p>
                </div>

                {greeting && (
                  <div className="mb-4 rounded-lg bg-green-50 p-4 text-center text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <p className="font-medium">¡Cuenta creada exitosamente!</p>
                    <p className="text-sm mt-1">
                      Ingresa tu contraseña para acceder a tu cuenta.
                    </p>
                  </div>
                )}

                {status && (
                  <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="ejemplo@correo.com"
                  />
                  <InputError message={errors.email} />
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    {canResetPassword && (
                      <TextLink
                        href="#"
                        className="ml-auto text-sm"
                      >
                        ¿Olvidaste tu contraseña?
                      </TextLink>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Contraseña"
                  />
                  <InputError message={errors.password} />
                </Field>

                <Field>
                  <Button type="submit" disabled={processing} className="w-full">
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar sesión
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  ¿No tienes una cuenta?{' '}
                  <TextLink href={urlFor('register.show')}>Regístrate</TextLink>
                </FieldDescription>
              </FieldGroup>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center mt-4">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
        </FieldDescription>
      </div>
    </div>
  )
}
