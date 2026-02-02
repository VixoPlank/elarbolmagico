import { useState } from 'react'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Receipt,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { router } from '@inertiajs/react'
import { urlFor } from '@/client'
import SaleConfirmation from './sale-confirmation'

export function CartSummary() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | null>(null)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [lastSale, setLastSale] = useState<{
    id: string
    total: number
    itemsCount: number
  } | null>(null)

  const { items, total, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCartStore()

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Por favor, selecciona un método de pago')
      return
    }

    setIsProcessing(true)

    router.post(
      urlFor('sales.store'),
      {
        paymentMethod,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      {
        onSuccess: (page) => {
          const latestSale = (page.props as any).latestSale
          if (latestSale) {
            setLastSale(latestSale)
            setShowConfirmation(true)
          }

          clearCart()
          setIsOpen(false)
          setPaymentMethod(null)
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0]
          toast.error((errorMsg as string) || 'Hubo un error al procesar la venta')
        },
        onFinish: () => setIsProcessing(false),
      }
    )
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <Button size="lg" className="h-14 px-6 rounded-xl shadow-lg relative group">
          <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Ver Carrito</span>
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0 border-2 border-background animate-in zoom-in"
            >
              {itemCount}
            </Badge>
          )}
          <Separator orientation="vertical" className="mx-4 h-6 bg-primary-foreground/20" />
          <span className="font-mono text-lg">${total.toLocaleString()}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full sm:max-w-md border-l">
        <div className="flex flex-col h-full bg-background shadow-2xl">
          <DrawerHeader className="border-b bg-muted/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-black flex items-center gap-2">
                  <Receipt className="h-6 w-6 text-primary" />
                  Nueva Venta
                </DrawerTitle>
                <DrawerDescription>Detalle de productos y pago</DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">El carrito está vacío</p>
                    <p className="text-muted-foreground">Agrega productos para comenzar la venta</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            ${item.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-mono font-bold text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md"
                            disabled={item.quantity >= item.stock}
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-muted/30 border-t space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Método de Pago
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
                  className={cn(
                    'h-16 flex-col gap-1 rounded-2xl transition-all',
                    paymentMethod === 'CASH' && 'ring-2 ring-primary ring-offset-2'
                  )}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <Banknote className="h-6 w-6" />
                  <span className="text-xs font-bold">Efectivo</span>
                </Button>
                <Button
                  variant={paymentMethod === 'CARD' ? 'default' : 'outline'}
                  className={cn(
                    'h-16 flex-col gap-1 rounded-2xl transition-all',
                    paymentMethod === 'CARD' && 'ring-2 ring-primary ring-offset-2'
                  )}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-xs font-bold">Tarjeta</span>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-foreground">
                <span>Total</span>
                <span className="text-primary font-mono">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-xl border-dashed hover:bg-destructive/5 hover:text-destructive hover:border-destructive transition-colors font-bold"
                onClick={clearCart}
                disabled={items.length === 0}
              >
                Limpiar
              </Button>
              <Button
                className="flex-2 h-14 rounded-xl text-lg font-black shadow-xl transition-all active:scale-[0.98]"
                disabled={items.length === 0 || isProcessing || !paymentMethod}
                onClick={handleCheckout}
              >
                {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
      {showConfirmation && lastSale && (
        <SaleConfirmation
          saleId={lastSale.id}
          total={lastSale.total}
          itemsCount={lastSale.itemsCount}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </Drawer>
  )
}
