import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  promoCode: string | null
  discountPercent: number
  flatDiscount: number
  
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  applyPromo: (code: string) => { success: boolean; message: string }
  removePromo: () => void

  // Indian Rupee Computed Values
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getShipping: () => number
  getGST: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      discountPercent: 0,
      flatDiscount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...items, { product, quantity }],
            isOpen: true,
          })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.product.id !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercent: 0, flatDiscount: 0 })
      },

      applyPromo: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase()
        if (code === 'ARKALUXURY' || code === 'VAJRAVIP') {
          set({ promoCode: 'ARKALUXURY', discountPercent: 0.15, flatDiscount: 0 })
          return { success: true, message: 'ARKA Luxury 15% VIP discount applied!' }
        } else if (code === 'ARKA10' || code === 'FESTIVE10') {
          set({ promoCode: 'ARKA10', discountPercent: 0.10, flatDiscount: 0 })
          return { success: true, message: 'Festive 10% welcome privilege applied!' }
        } else if (code === 'UPI100') {
          set({ promoCode: 'UPI100', discountPercent: 0, flatDiscount: 100 })
          return { success: true, message: 'Flat ₹100 instant UPI discount applied!' }
        }
        return { success: false, message: 'Invalid code. Try ARKALUXURY or ARKA10.' }
      },

      removePromo: () => {
        set({ promoCode: null, discountPercent: 0, flatDiscount: 0 })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal()
        const percentDisc = subtotal * get().discountPercent
        return percentDisc + get().flatDiscount
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        // Free delivery on orders above ₹999 anywhere in India
        if (subtotal === 0 || subtotal >= 999) return 0
        return 99
      },

      getGST: () => {
        // Indian 18% GST (Calculated within retail price or explicit)
        const subtotal = get().getSubtotal() - get().getDiscount()
        return Math.max(0, Math.round(subtotal * 0.18))
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal()
        if (subtotal === 0) return 0
        const discount = get().getDiscount()
        const shipping = get().getShipping()
        // Prices are inclusive of GST in Indian retail, add shipping if applicable
        return Math.max(0, Math.round(subtotal - discount + shipping))
      },
    }),
    {
      name: 'vajra-cart-storage',
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        flatDiscount: state.flatDiscount,
      }),
    }
  )
)
