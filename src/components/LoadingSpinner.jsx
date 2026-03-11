export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-dark-600 transition-colors"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin"></div>
      </div>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}
