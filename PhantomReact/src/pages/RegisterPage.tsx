import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi'
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
  const [showPassword, setShowPassword] = useState(false)

  return (
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center p-4">
        <div className="bg-[#2b2d31] p-8 w-full max-w-md rounded-2xl shadow-xl text-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black tracking-widest text-white uppercase">PHANTOM</h1>
            <p className="text-gray-400 text-sm mt-1">Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(f => (
                <div key={f.name} className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">{f.label}</label>
                  <div className="relative">
                    <input
                        name={f.name}
                        type={f.name === 'password' && showPassword ? 'text' : f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        maxLength={f.maxLength}
                        className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#ed4245] outline-none transition-all"
                        value={form[f.name]}
                        onChange={e => onChange(f.name, e.target.value)}
                    />
                    {f.name === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    )}
                  </div>
                </div>
            ))}

            {error && (
                <div className="flex items-center gap-2 text-sm text-[#ed4245] bg-[#3d2122] border border-[#ed4245]/20 rounded-lg p-3">
                  <FiAlertCircle className="shrink-0" /> {error}
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#ed4245] hover:bg-[#c43638] text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98]">
              {loading ? 'Registrando...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#ed4245] font-medium hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
  )
}
