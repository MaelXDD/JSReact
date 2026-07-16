import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout(): Promise<void> {
    await logout()
    navigate('/login')
  }

  return { handleLogout }
}
