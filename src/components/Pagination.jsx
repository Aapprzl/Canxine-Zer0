import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 flex items-center justify-center rounded-lg text-sm border border-slate-700 text-slate-400 hover:text-white hover:border-brand-500 transition-all">
            1
          </button>
          {start > 2 && <span className="text-slate-600 px-1">…</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition-all ${
            page === currentPage
              ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'border-slate-700 text-slate-400 hover:text-white hover:border-brand-500'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-600 px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg text-sm border border-slate-700 text-slate-400 hover:text-white hover:border-brand-500 transition-all">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
