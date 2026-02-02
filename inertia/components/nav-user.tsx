import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { UserInfo } from '@/components/user-info'
import { UserMenuContent } from '@/components/user-menu-content'
import { useIsMobile } from '@/hooks/use-mobile'
import { usePage } from '@inertiajs/react'
import { ChevronsUpDown } from 'lucide-react'
import type { Data } from '~/generated/data'

export function NavUser() {
  const { user } = usePage<Data.SharedProps>().props
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserInfo user={user as unknown as Data.User} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : state === 'collapsed' ? 'right' : 'bottom'}
            align="end"
            sideOffset={4}
          >
            <UserMenuContent user={user as unknown as Data.User} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
