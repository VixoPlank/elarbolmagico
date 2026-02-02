import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { AppSidebar } from '@/components/app-sidebar'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  bottomBar?: ReactNode
}

export default ({ children, breadcrumbs, bottomBar, ...props }: AppLayoutProps) => (
  <AppSidebarLayout sidebar={AppSidebar} breadcrumbs={breadcrumbs} bottomBar={bottomBar} {...props}>
    {children}
  </AppSidebarLayout>
)
