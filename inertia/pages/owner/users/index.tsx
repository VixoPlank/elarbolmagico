import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, User, Briefcase } from 'lucide-react'
import { urlFor } from '@/client'

enum Role {
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
  // SUPER_ADMIN and OWNER are not needed for selection here in creates
}

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string // Use string to accept backend roles
  isActive: boolean
  initials: string
  createdAt: string
}

interface Props {
  users: {
    data: UserData[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: {
    search: string
  }
}

export default function UsersIndex({ users, filters }: Props) {
  const [search, setSearch] = useState(filters.search)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Usuarios' }]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(urlFor('users.index'), { search }, { preserveState: true })
  }

  const handleToggleStatus = (user: UserData) => {
    router.patch(
      urlFor('users.update', { id: user.id }),
      {
        isActive: !user.isActive,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          // Optional toast here
        },
      }
    )
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Usuarios" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground">Gestiona el acceso y roles del sistema.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border w-full sm:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 bg-transparent h-8"
            />
          </form>
        </div>

        <div className="border rounded-lg shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Cuenta Activa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {user.initials}
                        </div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {user.role === Role.EMPLOYEE && <Briefcase className="h-3 w-3" />}
                        {user.role === Role.USER && <User className="h-3 w-3" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => handleToggleStatus(user)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create Modal */}
        <UserFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </OwnerLayout>
  )
}

function UserFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    role: Role.USER, // Default
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urlFor('users.store'), {
      onSuccess: () => {
        onOpenChange(false)
        reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Ingresa los datos para crear un nuevo usuario.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => setData('firstName', e.target.value)}
                required
              />
              {errors.firstName && (
                <span className="text-xs text-destructive">{errors.firstName}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => setData('lastName', e.target.value)}
                required
              />
              {errors.lastName && (
                <span className="text-xs text-destructive">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={data.role} onValueChange={(val: Role) => setData('role', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.USER}>Usuario (Cliente)</SelectItem>
                <SelectItem value={Role.EMPLOYEE}>Empleado</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <span className="text-xs text-destructive">{errors.role}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
              minLength={8}
            />
            {errors.password && <span className="text-xs text-destructive">{errors.password}</span>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? 'Crear Usuario' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
