import { FiShoppingCart, FiCheck } from 'react-icons/fi'
import SmartImage from '../common/SmartImage'
import { useAddToCart } from '../../hooks/useAddToCart'
import type { Producto } from '../../domain/entities'

interface ProductCardProps {
  readonly product: Producto
}

function addToCartButtonClass(added: boolean, outOfStock: boolean): string {
  if (added) return 'bg-green-600 text-white'
  if (outOfStock) return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  return 'bg-[#1a1b1e] hover:bg-black text-white' // Botón oscuro elegante
}

export default function ProductCard({ product }: ProductCardProps) {
  const { added, handleAdd } = useAddToCart(product)
  const outOfStock = product.stock === 0

  return (
      <div className="flex flex-col h-full bg-white transition-transform duration-200 hover:-translate-y-1">

        <div className="h-56 w-full flex items-center justify-center p-4 mb-2 overflow-hidden">
          <SmartImage
              src={product.imagen_url}
              alt={product.nombre}
              className="h-full object-contain"
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          {product.marca && (
              <span className="inline-block w-fit text-[10px] font-bold bg-[#1a1b1e] text-white px-3 py-0.5 rounded-full mb-2 uppercase">
            {product.marca}
          </span>
          )}

          <h3 className="font-bold text-gray-900 leading-tight mb-1">{product.nombre}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.descripcion}</p>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900">
              S/ {Number(product.precio).toFixed(2)}
            </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${outOfStock ? 'text-red-600' : 'text-green-700'}`}>
              {outOfStock ? 'Sin stock' : 'En stock'}
            </span>
            </div>

            <button
                onClick={handleAdd}
                disabled={outOfStock || added}
                className={`flex items-center justify-center gap-2 w-full py-2 rounded-md font-medium text-sm transition-colors ${addToCartButtonClass(added, outOfStock)}`}
            >
              {added ? (
                  <><FiCheck /> Agregado</>
              ) : (
                  <><FiShoppingCart /> Agregar al carrito</>
              )}
            </button>
          </div>
        </div>
      </div>
  )
}