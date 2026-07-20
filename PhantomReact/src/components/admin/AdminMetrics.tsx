import { FiAlertTriangle, FiStar } from 'react-icons/fi'
import { STOCK_BAJO_UMBRAL, useDashboardStats } from '../../hooks/useDashboardStats'
import type { Producto } from '../../domain/entities'

interface AdminMetricsProps {
  readonly products: Producto[]
}

function StockBajoCard({ items }: { readonly items: Producto[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FiAlertTriangle className="text-amber-500" />
        <h2 className="font-bold text-gray-900">Stock bajo</h2>
        <span className="ml-auto text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Ningún producto por debajo de {STOCK_BAJO_UMBRAL} unidades.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map(p => (
            <li key={p.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-700 truncate pr-2">{p.nombre}</span>
              <span className="font-semibold text-amber-600 whitespace-nowrap">{p.stock} un.</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DestacadosCard({ items }: { readonly items: Producto[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FiStar className="text-primary-600" />
        <h2 className="font-bold text-gray-900">Productos destacados</h2>
        <span className="ml-auto text-xs text-gray-400">por precio</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No hay productos disponibles.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map(p => (
            <li key={p.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-700 truncate pr-2">{p.nombre}</span>
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                S/ {Number(p.precio).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Dashboard de bienvenida para admin: métricas rápidas del catálogo. */
export default function AdminMetrics({ products }: AdminMetricsProps) {
  const { stockBajo, destacados } = useDashboardStats(products)

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StockBajoCard items={stockBajo} />
        <DestacadosCard items={destacados} />
      </div>
    </div>
  )
}
