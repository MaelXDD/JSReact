import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CartItem, Producto } from '../domain/entities'

type CartAction =
  | { type: 'ADD'; product: Producto }
  | { type: 'REMOVE'; id: number }
  | { type: 'UPDATE_QTY'; id: number; qty: number }
  | { type: 'CLEAR' }

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Producto) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const exists = state.some(i => i.id === action.product.id)
      if (exists) {
        return state.map(i =>
          i.id === action.product.id
            ? { ...i, qty: Math.min(i.qty + 1, i.stock) }
            : i
        )
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, qty: Math.max(1, Math.min(action.qty, i.stock)) } : i
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }: { readonly children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addItem = (product: Producto) => dispatch({ type: 'ADD', product })
  const removeItem = (id: number) => dispatch({ type: 'REMOVE', id })
  const updateQty = (id: number, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + i.precio * i.qty, 0)

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }),
    [items, totalItems, totalPrice]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
