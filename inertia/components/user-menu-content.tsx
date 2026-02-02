import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { UserInfo } from '@/components/user-info'
import type { Data } from '~/generated/data'
import { urlFor } from '@/client'
import { Link, router } from '@inertiajs/react'
import { LogOut, Settings } from 'lucide-react'

interface UserMenuContentProps {
  user: Data.User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const handleLogout = () => {
    router.post(
      urlFor('logout'),
      {},
      {
        onSuccess: () => {
          router.visit(urlFor('login.show'), { replace: true })
        },
        onError: () => {
          router.visit(urlFor('login.show'), { replace: true })
        },
      }
    )
  }

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" href={urlFor('profile.edit')}>
            <Settings className="mr-2" />
            Configuración
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2" />
        Cerrar sesión
      </DropdownMenuItem>
    </>
  )
}
