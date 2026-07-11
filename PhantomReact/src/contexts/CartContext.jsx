import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.product.id)
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

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addItem    = (product) => dispatch({ type: 'ADD', product })
  const removeItem = (id)      => dispatch({ type: 'REMOVE', id })
  const updateQty  = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart  = ()        => dispatch({ type: 'CLEAR' })

  const totalItems  = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice  = items.reduce((s, i) => s + i.precio * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
