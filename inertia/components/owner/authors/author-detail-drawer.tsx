import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { UserCircle, Globe, X, Info } from 'lucide-react'

interface Author {
  id: string
  name: string
  country: string
  bio: string | null
  img: string | null
  productsCount: number
}

interface AuthorDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  author: Author | null
}

export default function AuthorDetailDrawer({ isOpen, onClose, author }: AuthorDetailDrawerProps) {
  if (!author) return null

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-md">
        <div className="flex flex-col h-full bg-background shadow-xl">
          <DrawerHeader className="border-b flex flex-row items-center justify-between py-4 px-6 bg-muted/50">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-bold">Detalle del Autor</DrawerTitle>
                <DrawerDescription>Perfil completo y biografía.</DrawerDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted-foreground/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {author.img ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-foreground rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <img
                      src={author.img}
                      alt={author.name}
                      className="relative h-40 w-40 rounded-full object-cover border-4 border-background shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-inner">
                    <UserCircle className="h-24 w-24 text-muted-foreground/40" />
                  </div>
                )}
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {author.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{author.country}</span>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/40 rounded-2xl p-6 border border-border/50 transition-all hover:bg-muted/60">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Libros publicados
                      </p>
                      <h4 className="text-3xl font-black text-primary">{author.productsCount}</h4>
                    </div>
                    <div className="bg-primary/20 p-3 rounded-xl">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Biografía
                  </h4>
                  <div className="h-px flex-1 bg-border/60"></div>
                </div>
                <div className="bg-card/50 rounded-2xl p-6 border border-border/40 shadow-sm transition-all hover:shadow-md">
                  {author.bio ? (
                    <p className="text-base text-card-foreground leading-relaxed whitespace-pre-wrap italic">
                      "{author.bio}"
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 text-center py-4 italic">
                      No hay biografía disponible para este autor.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/30 backdrop-blur-sm">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              onClick={onClose}
            >
              Cerrar Detalle
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
