import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  BookOpen, LayoutDashboard, FolderOpen, BookMarked, FileText, LogOut, ChevronRight
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/categories', label: 'Kategori', icon: FolderOpen },
    { to: '/admin/topics', label: 'Topik', icon: BookMarked },
    { to: '/admin/articles', label: 'Artikel', icon: FileText },
  ]

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-50 dark:bg-dark-800 border-r border-slate-200 dark:border-slate-700/50 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Canxine-Zer0</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white hover:bg-brand-500/5 dark:hover:bg-slate-700/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  {label}
                  {isActive && <ChevronRight size={14} className="ml-auto text-brand-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-white dark:bg-dark-900 transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  )
}
