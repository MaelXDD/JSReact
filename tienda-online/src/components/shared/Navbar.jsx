import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
    const { profile, isAdmin, logout } = useAuth()
    const { totalItems } = useCart()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                    Phantom
                </Link>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-gray-500">
                        Hola, <span className="font-medium text-gray-800">{profile?.nombre ?? 'Usuario'}</span>
                        {isAdmin && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Admin</span>}
                    </span>

                    {isAdmin ? (
                        <Link to="/admin" className="flex items-center gap-1 text-sm btn-secondary">
                            <FiSettings /> Panel Admin
                        </Link>
                    ) : (
                        <Link to="/cart" className="relative flex items-center gap-1 text-sm btn-secondary">
                            <FiShoppingCart />
                            Carrito
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                        <FiLogOut />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}