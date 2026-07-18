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

function traducirErrorSupabase(err: unknown): string {
  if (!isSupabaseError(err)) {
    return 'Error al registrar. Intenta con otro email.'
  }

  const msg = err.message.toLowerCase()

  if (msg.includes('already registered') || msg.includes('already exists')) {
    return 'Este correo ya está registrado. Intenta iniciar sesión.'
  }
  if (msg.includes('password') && msg.includes('least')) {
    return 'La contraseña es demasiado corta.'
  }
  if (msg.includes('invalid email')) {
    return 'El correo electrónico no es válido.'
  }
  if (msg.includes('network')) {
    return 'Error de conexión. Intenta nuevamente.'
  }

  return 'Error al registrar. Intenta con otro email.'
}

export function useRegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterFormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(name: keyof RegisterFormState, value: string) {
    if (name === 'dni') {
      // solo dígitos, máximo 8
      const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
      setForm(f => ({ ...f, dni: soloNumeros }))
      return
    }

    if (name === 'telefono') {
      // solo dígitos, máximo 9
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9)
      setForm(f => ({ ...f, telefono: soloNumeros }))
      return
    }

    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setError('')

    if (form.dni && form.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos.')
      return
    }
    if (form.telefono && form.telefono.length !== 9) {
      setError('El teléfono debe tener 9 dígitos.')
      return
    }

    setLoading(true)
    try {
      // Crea el usuario en Supabase Auth se hashea y almacena la contraseña.
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError

      const { error: dbError } = await supabase.from('usuarios').insert({
        nombre: form.nombre,
        email: form.email,
        rol: 'USER',
        dni: form.dni,
        numero_telefono: form.telefono,
        direccion: form.direccion,
      })
      if (dbError) throw dbError
      await supabase.auth.signOut()
      navigate('/login')
    } catch (err) {
      setError(traducirErrorSupabase(err))
    } finally {
      setLoading(false)
    }
  }

  return { form, onChange, error, loading, handleSubmit }
}