import { Link } from 'react-router-dom'
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiCheck } from 'react-icons/fi'
import { useCheckout } from '../hooks/useCheckout'

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice, loading, success, handleCheckout } = useCheckout()

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <FiCheck className="text-4xl text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Compra confirmada!</h2>
        <p className="text-gray-500">Gracias por tu compra. Serás redirigido a la tienda.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <FiShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">
          <FiArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-2xl font-bold">Mi carrito ({totalItems} productos)</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img
                src={item.imagen_url || 'https://placehold.co/80x80?text=?'}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
                onError={e => { e.currentTarget.src = 'https://placehold.co/80x80?text=?' }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.nombre}</h3>
                <p className="text-sm text-gray-400">{item.marca}</p>
                <p className="text-primary-600 font-bold mt-1">S/ {Number(item.precio).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <FiTrash2 />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold"
                  >−</button>
                  <span className="w-6 text-center font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold"
                  >+</button>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  S/ {(item.precio * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate mr-2">{item.nombre} ×{item.qty}</span>
                <span className="shrink-0">S/ {(item.precio * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary-600">S/ {totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full mt-6 py-3"
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      </div>
    </div>
  )
}
