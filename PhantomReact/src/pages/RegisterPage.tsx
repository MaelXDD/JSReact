import { Link } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'
import { useRegisterForm, type RegisterFormState } from '../hooks/useRegisterForm'

const FIELDS: Array<{
  name: keyof RegisterFormState
  label: string
  type: string
  placeholder: string
  required?: boolean
  maxLength?: number
}> = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
  { name: 'dni', label: 'DNI', type: 'text', placeholder: '12345678', maxLength: 8 },
  { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '999000000', maxLength: 9 },
  { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Av. Lima 123' },
]

export default function RegisterPage() {
  const { form, onChange, error, loading, handleSubmit } = useRegisterForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Completa tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {FIELDS.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  maxLength={f.maxLength}
                  className="input-field"
                  value={form[f.name]}
                  onChange={e => onChange(f.name, e.target.value)}
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
