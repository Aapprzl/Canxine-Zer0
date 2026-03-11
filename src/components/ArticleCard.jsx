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
  const summary = article.description || (article.content
    ? article.content.replace(/[#*`>\[\]!]/g, '').slice(0, 100).trim() + '...'
    : 'Tidak ada deskripsi.')

  return (
    <Link
      to={`/artikel/${article.slug}`}
      className="group glass-card overflow-hidden hover-lift hover:border-brand-500/40 block"
    >
      {/* Thumbnail */}
      {article.image_url ? (
        <div className="h-44 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
          <FileText size={36} className="text-slate-600" />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {summary}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
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
