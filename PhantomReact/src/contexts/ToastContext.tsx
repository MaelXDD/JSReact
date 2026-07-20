import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

type ToastType = 'success' | 'error'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { readonly children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(current => current.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'error') => {
        const id = crypto.randomUUID()
        setToasts(current => [...current, { id, message, type }])
        setTimeout(() => removeToast(id), 4000)
    }, [removeToast])

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-[100] space-y-2 w-full max-w-sm">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-2 p-4 rounded-lg shadow-lg border text-sm ${
                            toast.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                        {toast.type === 'success'
                            ? <FiCheckCircle className="shrink-0 mt-0.5" />
                            : <FiAlertCircle className="shrink-0 mt-0.5" />
                        }
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="text-current opacity-60 hover:opacity-100">
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast debe usarse dentro de un ToastProvider')
    return context
}