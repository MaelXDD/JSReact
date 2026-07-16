import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import type { Producto } from '../domain/entities'

export function useAddToCart(product: Producto) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(): void {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return { added, handleAdd }
}
