import { Link } from 'react-router-dom'
import { FileText, Calendar, User } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ArticleCard({ article }) {
  let summary = article.description || ''

  if (summary) {
    const hasHtmlTags = /<[^>]*>/.test(summary)
    if (article.content_type === 'html' || hasHtmlTags) {
      summary = summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    } else {
      summary = summary.replace(/[#*`>\[\]!-]/g, ' ').replace(/\s+/g, ' ').trim()
    }
  } 
  else if (article.content) {
    if (article.content_type === 'html') {
      summary = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    } else {
      summary = article.content.replace(/[#*`>\[\]!-]/g, ' ').replace(/\s+/g, ' ').trim()
    }
  }

  summary = (summary || 'Tidak ada deskripsi.').slice(0, 100).trim()
  if (summary.length >= 100) summary += '...'

  return (
    <Link
      to={`/artikel/${article.slug}`}
      className="group glass-card overflow-hidden hover-lift hover:border-brand-500/40 block"
    >
      {/* Thumbnail */}
      {article.image_url ? (
        <div className="h-44 overflow-hidden relative group/img">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {article.image_source && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span className="text-[10px] text-white/90 truncate w-full flex items-center gap-1.5">
                Sumber: {article.image_source}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center transition-colors">
          <FileText size={36} className="text-slate-400 dark:text-slate-600" />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {summary}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
          {article.author && (
            <span className="flex items-center gap-1">
              <User size={11} />
              {article.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(article.created_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}
