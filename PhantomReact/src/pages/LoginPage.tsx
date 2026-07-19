import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi'
import { useLoginForm } from '../hooks/useLoginForm'

export default function LoginPage() {
  const { form, setEmail, setPassword, error, loading, handleSubmit } = useLoginForm()
  const [showPassword, setShowPassword] = useState(false)

  return (
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center p-4">
        <div className="bg-[#2b2d31] p-8 w-full max-w-md rounded-2xl shadow-xl text-white">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-widest text-white uppercase">PHANTOM</h1>
            <p className="text-gray-400 text-sm mt-2">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    id="email"
                    type="email"
                    required
                    className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg p-2.5 pl-10 text-white focus:ring-2 focus:ring-[#ed4245] outline-none transition-all"
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg p-2.5 pl-10 pr-10 text-white focus:ring-2 focus:ring-[#ed4245] outline-none transition-all"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-[#ed4245] bg-[#3d2122] border border-[#ed4245]/20 rounded-lg p-3">
                  <FiAlertCircle className="shrink-0" />
                  <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ed4245] hover:bg-[#c43638] text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tienes cuenta?{' '}
            <Link
                to="/register"
                className="text-[#ed4245] font-medium hover:text-white transition-colors hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
  )
}
