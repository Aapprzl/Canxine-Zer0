import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { FolderOpen, BookMarked, FileText, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ categories: 0, topics: 0, articles: 0, published: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: cats }, { count: tops }, { count: arts }, { count: pubs }] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('topics').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),
      ])
      setStats({ categories: cats || 0, topics: tops || 0, articles: arts || 0, published: pubs || 0 })
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Kategori', value: stats.categories, icon: FolderOpen, to: '/admin/categories', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20' },
    { label: 'Topik', value: stats.topics, icon: BookMarked, to: '/admin/topics', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10 dark:bg-violet-500/20' },
    { label: 'Total Artikel', value: stats.articles, icon: FileText, to: '/admin/articles', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10 dark:bg-brand-500/20' },
    { label: 'Artikel Dipublikasi', value: stats.published, icon: FileText, to: '/admin/articles', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20' },
  ]

  const quickLinks = [
    { to: '/admin/categories', label: 'Kelola Kategori', desc: 'Tambah, edit, atau hapus kategori', icon: FolderOpen },
    { to: '/admin/topics', label: 'Kelola Topik', desc: 'Atur topik dalam setiap kategori', icon: BookMarked },
    { to: '/admin/articles', label: 'Kelola Artikel', desc: 'Buat dan publikasikan artikel baru', icon: FileText },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Selamat datang kembali, <span className="text-slate-900 dark:text-white font-medium">Admin Pengguna</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, to, color, bg }) => (
          <Link key={label} to={to} className="glass-card p-5 hover-lift hover:border-brand-500/30 block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 transition-colors">{label}</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">{value}</p>
              </div>
              <div className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 transition-colors">Aksi Cepat</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to} className="group glass-card p-5 hover-lift hover:border-brand-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Icon size={16} className="text-brand-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm transition-colors">{label}</p>
                <p className="text-xs text-slate-500 transition-colors">{desc}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
