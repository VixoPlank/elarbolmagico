import AppLogo from '@/components/app-logo'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { type NavItem } from '@/types'
import { urlFor } from '@/client'
import { Link } from '@inertiajs/react'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  History,
  Users,
  FolderTree,
  Building2,
  UserCircle,
  BookOpen,
  Tag,
} from 'lucide-react'
import { useMemo } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Navigation items for admin
  const mainNavItems: NavItem[] = useMemo(() => {
    return [
      {
        title: 'Inicio',
        href: urlFor('dashboard'),
        icon: LayoutDashboard,
      },
      {
        title: 'Vender',
        href: urlFor('sales.create'),
        icon: ShoppingCart,
      },
      {
        title: 'Stock',
        href: urlFor('stock.index'),
        icon: Package,
      },
      {
        title: 'Reportes',
        href: urlFor('reports.index'),
        icon: BarChart3,
      },
      {
        title: 'Historial de ventas',
        href: urlFor('sales.index'),
        icon: History,
      },
      {
        title: 'Control de usuarios',
        href: urlFor('users.index'),
        icon: Users,
      },
      {
        title: 'Categoría',
        href: urlFor('categories.index'),
        icon: FolderTree,
      },
      {
        title: 'Editorial',
        href: urlFor('publishers.index'),
        icon: Building2,
      },
      {
        title: 'Autores',
        href: urlFor('authors.index'),
        icon: UserCircle,
      },
      {
        title: 'Temáticas',
        href: urlFor('topics.index'),
        icon: BookOpen,
      },
      {
        title: 'Marcas',
        href: urlFor('brands.index'),
        icon: Tag,
      },
    ]
  }, [])

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={urlFor('dashboard')}>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <NavMain items={mainNavItems} label="Menú Principal" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
