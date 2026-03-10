import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/tentang', label: 'Tentang' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
            <BookOpen size={18} className="text-white" />
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
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
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
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-700/50 bg-dark-900/95 backdrop-blur-lg px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
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
