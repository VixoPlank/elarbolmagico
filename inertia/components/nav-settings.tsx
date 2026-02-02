import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'

export function NavSettings({ items = [] }: { items: NavItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configuración</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = item.icon
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  {item.href ? (
                    <Link href={item.href} prefetch>
                      {IconComponent && <IconComponent />}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {IconComponent && <IconComponent />}
                      <span>{item.title}</span>
                    </a>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
