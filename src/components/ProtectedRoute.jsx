import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <LoadingSpinner text="Memeriksa autentikasi..." />
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return children
}
