import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'
import { ChevronRight, BookMarked, Home } from 'lucide-react'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (cat) {
        setCategory(cat)
        const { data: topicsData } = await supabase
          .from('topics')
          .select('*')
          .eq('category_id', cat.id)
          .order('created_at', { ascending: true })
        setTopics(topicsData || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (!category) return (
    <div className="page-container text-center py-24">
      <p className="text-slate-400 text-xl">Kategori tidak ditemukan.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Kembali ke Beranda</Link>
    </div>
  )

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 transition-colors">
        <Link to="/" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-slate-300 transition-colors">
          <Home size={14} /> Beranda
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 dark:text-slate-300 font-medium transition-colors">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title mb-3 transition-colors">{category.name}</h1>
        {category.description && (
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl transition-colors">{category.description}</p>
        )}
      </div>

      {/* Topics */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors">Daftar Topik</h2>
        <span className="badge badge-gray">{topics.length} topik</span>
      </div>

      {topics.length === 0 ? (
        <div className="glass-card p-12 text-center transition-colors">
          <p className="text-slate-600 dark:text-slate-400">Belum ada topik dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => (
            <Link
              key={topic.id}
              to={`/topik/${topic.slug}`}
              className="group glass-card p-5 hover-lift hover:border-brand-500/40 block"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookMarked size={16} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors mb-1 transition-colors">
                    {topic.name}
                  </h3>
                  {topic.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors">{topic.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
