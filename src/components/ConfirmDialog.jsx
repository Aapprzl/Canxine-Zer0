import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

export default function ConfirmDialog({ isOpen, title = 'Hapus Data', message, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative glass-card border border-red-500/20 dark:border-red-500/30 w-full max-w-md p-6 shadow-2xl shadow-black/20 dark:shadow-black/50 animate-in transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 transition-colors">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
              {message || 'Yakin ingin menghapus? Data tidak bisa dikembalikan.'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary text-sm py-2 px-4">
            Batal
          </button>
          <button onClick={onConfirm} className="btn-danger text-sm py-2 px-4">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
