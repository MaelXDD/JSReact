import { Link } from 'react-router-dom'
import { FiShoppingCart, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useLogout } from '../../hooks/useLogout'

export default function Navbar() {
  const { profile, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const { handleLogout } = useLogout()

  return (
      <nav className="bg-[#1a1b1e] border-b border-[#2b2d31] sticky top-0 z-50 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <Link to="/" className="text-2xl font-black tracking-widest uppercase text-white">
            PHANTOM
          </Link>
          <div className="flex items-center gap-6">
          <span className="hidden sm:block text-sm text-gray-400">
            Hola, <span className="font-medium text-white">{profile?.nombre ?? 'Usuario'}</span>
            {isAdmin && <span className="ml-2 text-xs bg-[#ed4245] text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>}
          </span>
            {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#ed4245] transition-colors">
                  <FiSettings /> <span className="hidden sm:inline">Panel</span>
                </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
              <FiShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ed4245] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems}
              </span>
              )}
            </Link>

            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#ed4245] transition-colors">
              <FiLogOut />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>
  )
}