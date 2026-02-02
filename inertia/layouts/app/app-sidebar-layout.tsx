import { AppShell } from '@/components/app-shell'
import { AppSidebarHeader } from '@/components/app-sidebar-header'
import { SidebarInset, Sidebar } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useFlashToast } from '@/hooks/use-flash-toast'
import { type BreadcrumbItem } from '@/types'
import { type PropsWithChildren, type ReactNode, type ComponentType } from 'react'

interface AppSidebarLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  bottomBar?: ReactNode
  sidebar: ComponentType<React.ComponentProps<typeof Sidebar>>
}

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  bottomBar,
  sidebar: SidebarComponent,
}: PropsWithChildren<AppSidebarLayoutProps>) {
  useFlashToast()
  return (
    <>
      <AppShell variant="sidebar">
        <SidebarComponent />
        <SidebarInset>
          <AppSidebarHeader breadcrumbs={breadcrumbs} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className={bottomBar ? 'pb-24' : ''}>{children}</div>
          </div>
          {bottomBar && (
            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] backdrop-blur md:left-[var(--sidebar-width)] md:px-4 group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)]">
              {bottomBar}
            </div>
          )}
        </SidebarInset>
      </AppShell>
      <Toaster position="top-right" richColors />
    </>
  )
}
