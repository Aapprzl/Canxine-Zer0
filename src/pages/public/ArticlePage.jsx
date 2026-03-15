import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { ChevronRight, Home, User, Calendar, ArrowLeft } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*, topics(id, name, slug, categories(id, name, slug))')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (data) {
        setArticle(data)
        setTopic(data.topics)
      }
      setLoading(false)
    }
    fetchData()
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (!article) return (
    <div className="page-container text-center py-24">
      <p className="text-slate-600 dark:text-slate-400 text-xl transition-colors">Artikel tidak ditemukan atau belum dipublikasikan.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Kembali ke Beranda</Link>
    </div>
  )

  const cat = topic?.categories

  return (
    <div className="page-container max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-slate-300 transition-colors">
          <Home size={14} /> Beranda
        </Link>
        {cat && (
          <>
            <ChevronRight size={14} />
            <Link to={`/kategori/${cat.slug}`} className="hover:text-slate-300 transition-colors">{cat.name}</Link>
          </>
        )}
        {topic && (
          <>
            <ChevronRight size={14} />
            <Link to={`/topik/${topic.slug}`} className="hover:text-brand-600 dark:hover:text-slate-300 transition-colors">{topic.name}</Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-slate-900 dark:text-slate-300 truncate max-w-xs font-medium transition-colors">{article.title}</span>
      </nav>

      {/* Hero image */}
      {article.image_url && (
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden aspect-video relative group">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
          {article.image_source && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center italic transition-colors">
              Sumber gambar: {article.image_source}
            </p>
          )}
        </div>
      )}

      {/* Article header */}
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 transition-colors">{article.title}</h1>

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-700/50">
        {article.author && (
          <span className="flex items-center gap-1.5">
            <User size={13} /> {article.author}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Calendar size={13} /> {formatDate(article.created_at)}
        </span>
      </div>

      {/* Content - Markdown or HTML */}
      {article.content_type === 'html' ? (
        <article 
          className="prose dark:prose-invert prose-slate max-w-none transition-colors
            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold
            prose-p:text-slate-700 dark:prose-p:text-white prose-p:leading-relaxed
            prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-accent-600 dark:prose-code:text-accent-400 prose-code:bg-slate-100 dark:prose-code:bg-dark-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-slate-50 dark:prose-pre:bg-dark-800 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700
            prose-blockquote:border-brand-500 prose-blockquote:bg-brand-500/5 prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-hr:border-slate-200 dark:prose-hr:border-slate-700
            prose-table:text-slate-700 dark:prose-table:text-slate-300 prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-td:border-slate-200 dark:prose-td:border-slate-700
          " 
          dir="auto"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      ) : (
        <article className="prose dark:prose-invert prose-slate max-w-none transition-colors
          prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold
          prose-p:text-slate-700 dark:prose-p:text-white prose-p:leading-relaxed
          prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
          prose-code:text-accent-600 dark:prose-code:text-accent-400 prose-code:bg-slate-100 dark:prose-code:bg-dark-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-50 dark:prose-pre:bg-dark-800 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700
          prose-blockquote:border-brand-500 prose-blockquote:bg-brand-500/5 prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
          prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-hr:border-slate-200 dark:prose-hr:border-slate-700
          prose-table:text-slate-700 dark:prose-table:text-slate-300 prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-td:border-slate-200 dark:prose-td:border-slate-700
        " dir="auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {article.content || ''}
          </ReactMarkdown>
        </article>
      )}

      {/* Back link */}
      {topic && (
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <Link to={`/topik/${topic.slug}`} className="btn-secondary">
            <ArrowLeft size={16} />
            Kembali ke {topic.name}
          </Link>
        </div>
      )}
    </div>
  )
}
