import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { crearVenta } from '../repositories/ventasRepository'
import { crearDetalleVentas } from '../repositories/detalleVentasRepository'
import { actualizarStock } from '../repositories/productosRepository'

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

      const venta = await crearVenta({
        fecha: new Date().toISOString(),
        total: totalPrice,
        cantidad_items: totalItems,
        usuario_id: profile.id,
        numero_orden,
      })

      const detalles = items.map(item => ({
        venta_id: venta.id,
        producto_id: item.id,
        cantidad: item.qty,
        precio_unitario: item.precio,
        subtotal: item.precio * item.qty,
      }))
      await crearDetalleVentas(detalles)

      for (const item of items) {
        await actualizarStock(item.id, item.stock - item.qty)
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
