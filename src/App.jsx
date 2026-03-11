import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Layouts
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'

// Guards
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import HomePage from './pages/public/HomePage'
import CategoryPage from './pages/public/CategoryPage'
import TopicPage from './pages/public/TopicPage'
import ArticlePage from './pages/public/ArticlePage'
import AboutPage from './pages/public/AboutPage'
import NotFound from './pages/NotFound'

// Admin Pages
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminTopics from './pages/admin/AdminTopics'
import AdminArticles from './pages/admin/AdminArticles'
import AdminArticleEditor from './pages/admin/AdminArticleEditor'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/kategori/:slug" element={<CategoryPage />} />
            <Route path="/topik/:slug" element={<TopicPage />} />
            <Route path="/artikel/:slug" element={<ArticlePage />} />
            <Route path="/tentang" element={<AboutPage />} />
          </Route>

          {/* Admin Login (standalone – no AdminLayout) */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="topics" element={<AdminTopics />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<AdminArticleEditor />} />
            <Route path="articles/edit/:id" element={<AdminArticleEditor />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
