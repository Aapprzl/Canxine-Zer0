import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { BookOpen, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  // If already authenticated as admin, redirect to dashboard
  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />

  const onSubmit = async ({ email, password }) => {
    setSubmitting(true)
    setAuthError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setAuthError(err.message || 'Login gagal. Periksa kembali email dan password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-dark-900 to-accent-600/10 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-gradient">Canxine-Zer0</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Login Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Masuk ke panel pengelolaan konten</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {authError && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="admin@canxine-zer0.com"
                {...register('email', { required: 'Email wajib diisi.' })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`input-field pr-11 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password wajib diisi.' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3 mt-2">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={16} /> Masuk</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
