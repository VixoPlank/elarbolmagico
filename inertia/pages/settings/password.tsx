import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type PasswordField = 'currentPassword' | 'password' | 'passwordConfirmation'

export default function Password() {
  const [showPassword, setShowPassword] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    password: false,
    passwordConfirmation: false,
  })

  const toggleShow = (field: PasswordField) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const breadcrumbs = [
    {
      title: 'Cambiar contraseña',
    },
  ]

  const passwordInput = useRef<HTMLInputElement>(null)
  const currentPasswordInput = useRef<HTMLInputElement>(null)

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  })

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault()

    put('/settings/password', {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errs) => {
        if (errs.password) {
          reset('password', 'passwordConfirmation')
          passwordInput.current?.focus()
        }
        if (errs.currentPassword) {
          reset('currentPassword')
          currentPasswordInput.current?.focus()
        }
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contraseña" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Actualizar contraseña"
            description="Asegúrate de usar una contraseña segura para proteger tu cuenta"
          />

          <form onSubmit={updatePassword} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>

              <div className="relative">
                <Input
                  id="currentPassword"
                  ref={currentPasswordInput}
                  value={data.currentPassword}
                  onChange={(e) => setData('currentPassword', e.target.value)}
                  type={showPassword.currentPassword ? 'text' : 'password'}
                  className="block w-full pr-10"
                  autoComplete="current-password"
                  placeholder="Contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('currentPassword')}
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword.currentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <InputError message={errors.currentPassword} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Nueva contraseña</Label>

              <div className="relative">
                <Input
                  id="password"
                  ref={passwordInput}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  type={showPassword.password ? 'text' : 'password'}
                  className="mt-1 block w-full pr-10"
                  autoComplete="new-password"
                  placeholder="Nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('password')}
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword.password ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passwordConfirmation">Confirmar contraseña</Label>

              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  value={data.passwordConfirmation}
                  onChange={(e) => setData('passwordConfirmation', e.target.value)}
                  type={showPassword.passwordConfirmation ? 'text' : 'password'}
                  className="block w-full pr-10"
                  autoComplete="new-password"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('passwordConfirmation')}
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword.passwordConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <InputError message={errors.passwordConfirmation} />
            </div>

            <div className="flex items-center gap-4">
              <Button disabled={processing} className="rounded-xl font-bold">
                Guardar contraseña
              </Button>

              {recentlySuccessful && (
                <p className="text-muted-foreground text-sm animate-pulse">Guardado...</p>
              )}
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
