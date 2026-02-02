import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { OwnerSidebar } from '@/components/owner/owner-sidebar'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode } from 'react'

interface OwnerLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  bottomBar?: ReactNode
}

export default function OwnerLayout({
  children,
  breadcrumbs,
  bottomBar,
  ...props
}: OwnerLayoutProps) {
  return (
    <AppSidebarLayout
      sidebar={OwnerSidebar}
      breadcrumbs={breadcrumbs}
      bottomBar={bottomBar}
      {...props}
    >
      {children}
    </AppSidebarLayout>
  )
}
