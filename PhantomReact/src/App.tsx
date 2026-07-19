import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

import LoginPage from './pages/LoginPage'
import StorePage from './pages/StorePage'
import CartPage from './pages/CartPage'
import AdminPage from './pages/AdminPage'
import RegisterPage from './pages/RegisterPage'

import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'

function PrivateRoute({ children }: { readonly children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="text-gray-500">Cargando...</span></div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { readonly children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="text-gray-500">Cargando...</span></div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas cliente */}
          <Route path="/" element={
            <PrivateRoute><StorePage /></PrivateRoute>
          } />
          <Route path="/cart" element={
            <PrivateRoute><CartPage /></PrivateRoute>
          } />

          {/* Rutas admin */}
          <Route path="/admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {user && <Footer />}
    </div>
  )
}
