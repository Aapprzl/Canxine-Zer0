import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import CategoryCard from '../../components/CategoryCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Sparkles } from 'lucide-react'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    hero_badge: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['hero_title', 'hero_title_highlight', 'hero_subtitle', 'hero_badge'])

      if (settingsData) {
        const settingsMap = {}
        settingsData.forEach(item => {
          settingsMap[item.key] = item.value
        })
        setSettings(prev => ({ ...prev, ...settingsMap }))
      }

      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (catError) setError(catError.message)
      else setCategories(catData || [])
      
      setLoading(false)
    }

    fetchData()

    // Realtime subscription for categories
    const channel = supabase
      .channel('realtime home-categories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' }, 
        () => {
          fetchData() // Refetch when categories change
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--bg-secondary)] dark:bg-dark-900 pt-16 pb-20 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="page-container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-sm font-medium mb-6">
            <Sparkles size={14} />
            {settings.hero_badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] dark:text-white mb-5 leading-tight tracking-tight transition-colors">
            {settings.hero_title}{' '}
            <span className="text-gradient">{settings.hero_title_highlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
            {settings.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Kategori</h2>
            <p className="text-[var(--text-secondary)] mt-1 transition-colors">Pilih kategori untuk mulai belajar</p>
          </div>
          {categories.length > 0 && (
            <span className="badge badge-gray">{categories.length} kategori</span>
          )}
        </div>

        {error && (
          <div className="glass-card border-red-500/30 p-6 text-center">
            <p className="text-red-400">Gagal memuat data: {error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-secondary)] text-lg transition-colors">Belum ada kategori.</p>
            <p className="text-[var(--text-secondary)] opacity-70 text-sm mt-2 transition-colors">admin dapat menambahkan kategori dari panel admin.</p>
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
