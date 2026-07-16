import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export interface RegisterFormState {
  nombre: string
  email: string
  password: string
  dni: string
  telefono: string
  direccion: string
}

const EMPTY_FORM: RegisterFormState = {
  nombre: '', email: '', password: '', dni: '', telefono: '', direccion: '',
}

function isSupabaseError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function useRegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterFormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(name: keyof RegisterFormState, value: string) {
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Crea el usuario en Supabase Auth: aquí es donde se hashea y almacena la contraseña.
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError

      // Inserta el perfil en la tabla `usuarios` con rol Cliente por defecto.
      // Importante (seguridad): NUNCA se guarda la contraseña en esta tabla.
      // Supabase Auth ya la gestiona de forma segura (hash + salt); duplicarla
      // aquí la dejaría en texto plano y accesible desde cualquier consulta
      // a `usuarios`, lo que sería una fuga de credenciales.
      const { error: dbError } = await supabase.from('usuarios').insert({
        nombre: form.nombre,
        email: form.email,
        rol: 'USER',
        dni: form.dni,
        numero_telefono: form.telefono,
        direccion: form.direccion,
      })
      if (dbError) throw dbError

      navigate('/login')
    } catch (err) {
      setError(isSupabaseError(err) ? err.message : 'Error al registrar. Intenta con otro email.')
    } finally {
      setLoading(false)
    }
  }

  return { form, onChange, error, loading, handleSubmit }
}
