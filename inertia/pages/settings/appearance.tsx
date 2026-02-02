import { Head } from '@inertiajs/react'
import AppearanceTabs from '@/components/appearance-tabs'
import HeadingSmall from '@/components/heading-small'
import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'

export default function Appearance() {
  const breadcrumbs = [
    {
      title: 'Configuración de apariencia',
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Apariencia" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Apariencia"
            description="Personaliza cómo se ve el sistema para ti"
          />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
