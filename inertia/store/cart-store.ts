import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  stock: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: { id: string; name: string; price: number; stock: number }) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id)
        if (existing) {
          const newItems = get().items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
          set({
            items: newItems,
            total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
          })
        } else {
          const newItems = [...get().items, { ...product, quantity: 1 }]
          set({
            items: newItems,
            total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
          })
        }
      },
      increaseQuantity: (id) => {
        const newItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })
      },
      decreaseQuantity: (id) => {
        const newItems = get()
          .items.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0)
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })
      },
      removeItem: (id) => {
        const newItems = get().items.filter((item) => item.id !== id)
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
