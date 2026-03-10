import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import CategoryCard from '../../components/CategoryCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Sparkles } from 'lucide-react'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) setError(error.message)
      else setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-900 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-dark-900 to-accent-600/10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="page-container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-6">
            <Sparkles size={14} />
            Platform Pembelajaran Pribadi
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Selamat Datang di{' '}
            <span className="text-gradient">Canxine-Zer0</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Jelajahi materi pembelajaran terstruktur dalam berbagai kategori dan topik.
            Belajar dengan cara Anda sendiri.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Kategori</h2>
            <p className="text-slate-400 mt-1">Pilih kategori untuk mulai belajar</p>
          </div>
          {categories.length > 0 && (
            <span className="badge badge-gray">{categories.length} kategori</span>
          )}
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="glass-card border-red-500/30 p-6 text-center">
            <p className="text-red-400">Gagal memuat data: {error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400 text-lg">Belum ada kategori.</p>
            <p className="text-slate-500 text-sm mt-2">admin dapat menambahkan kategori dari panel admin.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
