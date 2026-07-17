import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { isSupabaseError } from '../utils/isSupabaseError'

export function useLogout() {
  const { logout } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  async function handleLogout(): Promise<void> {
    try {
      await logout()
      clearCart()
      navigate('/login')
    } catch (err) {
      alert('Error al cerrar sesión: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
    }
  }

  return { handleLogout }
}