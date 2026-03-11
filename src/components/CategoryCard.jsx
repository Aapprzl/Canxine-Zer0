import { Link } from 'react-router-dom'
import { FolderOpen, ArrowRight } from 'lucide-react'

const COLORS = [
  'from-indigo-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
]

export default function CategoryCard({ category, index = 0 }) {
  const gradient = COLORS[index % COLORS.length]

  return (
    <Link
      to={`/kategori/${category.slug}`}
      className="group glass-card p-6 hover-lift hover:border-brand-500/40 hover:glow-brand block cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <FolderOpen size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors transition-colors">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 transition-colors">
          {category.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
        Lihat Topik <ArrowRight size={12} />
      </span>
    </Link>
  )
}
