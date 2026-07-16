import { FiShoppingCart, FiCheck } from 'react-icons/fi'
import SmartImage from '../common/SmartImage'
import { useAddToCart } from '../../hooks/useAddToCart'
import type { Producto } from '../../domain/entities'

interface ProductCardProps {
  readonly product: Producto
}

function addToCartButtonClass(added: boolean, outOfStock: boolean): string {
  if (added) return 'bg-green-500 text-white'
  if (outOfStock) return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  return 'bg-primary-600 hover:bg-primary-700 text-white'
}

export default function ProductCard({ product }: ProductCardProps) {
  const { added, handleAdd } = useAddToCart(product)
  const outOfStock = product.stock === 0

  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">

      <div className="relative h-48 w-full bg-white p-2 overflow-hidden flex items-center justify-center">
        <SmartImage
          src={product.imagen_url}
          alt={product.nombre}
          className="w-full h-full"
        />

        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}

        {product.categorias?.nombre && (
          <span className="absolute top-2 left-2 text-xs bg-white/90 text-gray-600 px-2 py-0.5 rounded-full border">
            {product.categorias.nombre}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.marca}</p>
        <h3 className="font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">{product.nombre}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.descripcion}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary-600">
            S/ {Number(product.precio).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">{product.stock} en stock</span>
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock || added}
          className={`mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 ${addToCartButtonClass(added, outOfStock)}`}
        >
          {added ? (
            <><FiCheck /> Agregado</>
          ) : (
            <><FiShoppingCart /> Agregar al carrito</>
          )}
        </button>
      </div>
    </div>
  )
}
