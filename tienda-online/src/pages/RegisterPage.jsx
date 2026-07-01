import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiPackage, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../lib/supabaseClient'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', dni: '', telefono: '', direccion: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError

      // 2. Insertar en tabla `usuarios` con rol Cliente por defecto
      const { error: dbError } = await supabase.from('usuarios').insert({
        nombre:           form.nombre,
        email:            form.email,
        password:         form.password,
        rol:              'USER',
        dni:              form.dni,
        numero_telefono:  form.telefono,
        direccion:        form.direccion,
      })
      if (dbError) throw dbError

      navigate('/login')
    } catch (err) {
      setError(err.message ?? 'Error al registrar. Intenta con otro email.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'nombre',    label: 'Nombre completo', type: 'text',  placeholder: 'Juan Pérez' },
    { name: 'email',     label: 'Email',           type: 'email', placeholder: 'tu@email.com' },
    { name: 'password',  label: 'Contraseña',      type: 'password', placeholder: '••••••••' },
    { name: 'dni',       label: 'DNI',             type: 'text',  placeholder: '12345678' },
    { name: 'telefono',  label: 'Teléfono',        type: 'tel',   placeholder: '+51 999 000 000' },
    { name: 'direccion', label: 'Dirección',       type: 'text',  placeholder: 'Av. Lima 123' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
            <FiPackage className="text-2xl text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Completa tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                required={['nombre','email','password'].includes(f.name)}
                placeholder={f.placeholder}
                className="input-field"
                value={form[f.name]}
                onChange={onChange}
              />
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <FiAlertCircle className="shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
