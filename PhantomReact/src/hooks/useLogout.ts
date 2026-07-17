import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function isSupabaseError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout(): Promise<void> {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      alert('Error al cerrar sesión: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
    }
  }

  return { handleLogout }
}