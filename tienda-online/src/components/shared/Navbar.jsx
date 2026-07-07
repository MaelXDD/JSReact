// src/components/shared/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
  return (
      <nav className="bg-[#1a1a1a] text-white py-4 px-6 flex items-center justify-between shadow-lg">

        {/* Logo a la izquierda */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">PHANTOM</span>
        </div>

        {/* Enlaces de navegación */}
        <div className="flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-white transition">VIDEOJUEGOS</a>
          <a href="#" className="hover:text-white transition">CONSOLAS</a>
          <a href="#" className="hover:text-white transition">COLECCIONABLES</a>
          <a href="#" className="hover:text-white transition">PERIFÉRICOS</a>
        </div>

        {/* Buscador, Usuario y Carrito a la derecha */}
        <div className="flex items-center gap-4">
          <input
              type="text"
              placeholder="Buscar productos..."
              className="bg-white text-black px-3 py-1.5 rounded text-sm w-48 focus:outline-none"
          />
          <div className="flex items-center gap-4 text-xl">
            <button className="hover:text-gray-400"><i className="fa-solid fa-user"></i></button>
            <button className="hover:text-gray-400 relative">
              <i className="fa-solid fa-cart-shopping"></i>
              {}
            </button>
          </div>
        </div>

      </nav>
  )
}
