import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import type { Data } from '~/generated/data'

import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
}

export default function Profile() {
  const { user } = usePage<Data.SharedProps>().props

  if (!user) {
    return null
  }

  const breadcrumbs = [
    {
      title: 'Configuración de perfil',
    },
  ]

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    patch('/settings/profile', {
      preserveScroll: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Perfil" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Información del perfil"
            description="Actualiza tu información personal y correo electrónico"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  className="mt-1 block w-full rounded-xl"
                  value={data.firstName}
                  onChange={(e) => setData('firstName', e.target.value)}
                  required
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                />
                <InputError message={errors.firstName} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  className="mt-1 block w-full rounded-xl"
                  value={data.lastName}
                  onChange={(e) => setData('lastName', e.target.value)}
                  required
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                />
                <InputError message={errors.lastName} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                className="mt-1 block w-full rounded-xl"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="email"
                placeholder="correo@ejemplo.com"
              />
              <InputError message={errors.email} />
            </div>

            <div className="flex items-center gap-4">
              <Button disabled={processing} className="rounded-xl font-bold">
                Guardar cambios
              </Button>

              {recentlySuccessful && (
                <p className="text-sm text-muted-foreground animate-pulse">Guardado</p>
              )}
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
