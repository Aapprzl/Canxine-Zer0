import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ArticleCard from '../../components/ArticleCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'
import { ChevronRight, Home } from 'lucide-react'
import * as TablerIcons from '@tabler/icons-react'

const PER_PAGE = 10

export default function TopicPage() {
  const { slug } = useParams()
  const [topic, setTopic] = useState(null)
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopic = async () => {
      const { data: t } = await supabase
        .from('topics')
        .select('*, categories(id, name, slug)')
        .eq('slug', slug)
        .single()

      if (t) {
        setTopic(t)
        setCategory(t.categories)
      }
      setLoading(false)
    }
    fetchTopic()
  }, [slug])

  useEffect(() => {
    if (!topic) return

    const fetchArticles = async () => {
      const from = (currentPage - 1) * PER_PAGE
      const to = from + PER_PAGE - 1

      const { data, count } = await supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('topic_id', topic.id)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      setArticles(data || [])
      setTotalCount(count || 0)
    }
    fetchArticles()
  }, [topic, currentPage])

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  if (loading) return <LoadingSpinner />

  if (!topic) return (
    <div className="page-container text-center py-24">
      <p className="text-slate-400 text-xl">Topik tidak ditemukan.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Kembali ke Beranda</Link>
    </div>
  )

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap transition-colors">
        <Link to="/" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-slate-300 transition-colors">
          <Home size={14} /> Beranda
        </Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link to={`/kategori/${category.slug}`} className="hover:text-brand-600 dark:hover:text-slate-300 transition-colors">
              {category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-slate-900 dark:text-slate-300 font-medium transition-colors">{topic.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          {topic.icon && (() => {
            const IconComponent = TablerIcons[topic.icon] || TablerIcons.IconBookmark
            return (
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <IconComponent size={24} className="text-brand-400" />
              </div>
            )
          })()}
          <h1 className="section-title transition-colors">{topic.name}</h1>
        </div>
        {topic.description && (
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl transition-colors">{topic.description}</p>
        )}
      </div>

      {/* Articles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors">Daftar Artikel</h2>
        <span className="badge badge-gray">{totalCount} artikel</span>
      </div>

      {articles.length === 0 ? (
        <div className="glass-card p-12 text-center transition-colors">
          <p className="text-slate-600 dark:text-slate-400">Belum ada artikel dalam topik ini.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}
