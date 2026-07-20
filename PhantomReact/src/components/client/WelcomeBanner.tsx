import { FiShoppingBag } from 'react-icons/fi'
import type { Categoria } from '../../domain/entities'

interface WelcomeBannerProps {
  readonly nombre?: string
  readonly categories: Categoria[]
  readonly onSelectCategory: (id: number) => void
}

/** Dashboard de bienvenida para clientes: saludo + accesos rápidos a categorías. */
export default function WelcomeBanner({ nombre, categories, onSelectCategory }: WelcomeBannerProps) {
  const primerNombre = nombre?.split(' ')[0]

  return (
    <div className="card p-6 mb-8 bg-[#1a1b1e] text-white border-none">
      <div className="flex items-center gap-3 mb-1">
        <FiShoppingBag className="text-2xl text-accent" />
        <h1 className="text-2xl font-bold">
          {primerNombre ? `Hola, ${primerNombre}` : 'Bienvenido de vuelta'}
        </h1>
      </div>
      <p className="text-gray-300 text-sm mb-4">
        Explora los últimos lanzamientos y encuentra tu próximo juego favorito.
      </p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
