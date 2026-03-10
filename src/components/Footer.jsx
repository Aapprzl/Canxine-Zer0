import { Link } from 'react-router-dom'
import { BookOpen, Github } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-700/50 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Canxine-Zer0</p>
              <p className="text-xs text-slate-500">Platform Pembelajaran Pribadi</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-300 transition-colors">Beranda</Link>
            <Link to="/tentang" className="hover:text-slate-300 transition-colors">Tentang</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {year} Canxine-Zer0. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
