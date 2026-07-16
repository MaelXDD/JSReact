import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LoginFormState {
  email: string
  password: string
}

export function useLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function setEmail(email: string) {
    setForm(f => ({ ...f, email }))
  }

  function setPassword(password: string) {
    setForm(f => ({ ...f, password }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return { form, setEmail, setPassword, error, loading, handleSubmit }
}
