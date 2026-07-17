import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { ventaService } from '../services/ventaService'
import { productosService } from '../services/productoService'

function isSupabaseError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function useCheckout() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleCheckout(): Promise<void> {
    if (items.length === 0 || !profile) return
    setLoading(true)
    try {
      const numero_orden = `ORD-${Date.now()}`

      const detalles = items.map(item => ({
        producto_id: item.id,
        cantidad: item.qty,
        precio_unitario: item.precio,
        subtotal: item.precio * item.qty,
      }))

      await ventaService.registrarCompra(
          {
            fecha: new Date().toISOString(),
            total: totalPrice,
            cantidad_items: totalItems,
            usuario_id: profile.id,
            numero_orden,
          },
          detalles,
      )

      for (const item of items) {
        await productosService.actualizarStock(item.id, item.stock - item.qty)
      }

      clearCart()
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      alert('Error al procesar la compra: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  return {
    items, removeItem, updateQty, totalItems, totalPrice,
    loading, success, handleCheckout,
  }
}