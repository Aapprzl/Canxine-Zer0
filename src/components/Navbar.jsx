import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/tentang', label: 'Tentang' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
            <img src="/logo.svg" alt="Canxine-Zer0 Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold text-gradient">Canxine-Zer0</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-accent-400 hover:bg-accent-500/10 transition-colors border border-accent-500/30"
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          )}
          <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-700/50">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-accent-400 hover:bg-accent-500/10"
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
