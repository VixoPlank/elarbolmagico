import AppLogoIcon from '@/components/app-logo-icon'
import { Toaster } from 'sonner'
import { urlFor } from '@/client'
import { Link } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'

interface AuthLayoutProps {
  title?: string
  description?: string
}

export default function AuthSplitLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <>
      <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col border-r bg-white p-10 text-zinc-900 lg:flex dark:bg-white dark:text-zinc-900">
          <Link
            href={urlFor('home')}
            className="relative z-20 flex items-center text-lg font-medium"
          >
            <AppLogoIcon className="h-12 w-auto max-w-full fill-current text-zinc-900 dark:text-zinc-900" />
          </Link>
        </div>
        <div className="w-full lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Link
              href={urlFor('home')}
              className="relative z-20 flex items-center justify-center lg:hidden"
            >
              <AppLogoIcon className="h-16 w-auto max-w-full fill-current text-black sm:h-20" />
            </Link>
            <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="text-muted-foreground text-sm text-balance">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  )
}
