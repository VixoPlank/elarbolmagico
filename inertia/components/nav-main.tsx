import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function NavMain({ items = [], label = 'Menú' }: { items?: NavItem[]; label?: string }) {
  const { url } = usePage()

  const isItemActive = (itemHref: string, currentUrl: string) => {
    if (!itemHref) return false

    // Normalize URLs (ignore query params and trailing slashes)
    const normalizedHref = itemHref.split('?')[0].replace(/\/$/, '')
    const normalizedUrl = currentUrl.split('?')[0].replace(/\/$/, '')

    // Use exact match only
    return normalizedHref === normalizedUrl
  }

  if (!items || items.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.isActive ?? (item.href ? isItemActive(item.href, url) : false)
            const IconComponent = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
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
