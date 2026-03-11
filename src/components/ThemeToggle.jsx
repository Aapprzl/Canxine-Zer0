import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 
        hover:text-brand-500 dark:hover:text-brand-400 transition-all duration-300 border border-slate-200 dark:border-slate-700/50"
      title={theme === 'dark' ? 'Ganti ke Mode Siang' : 'Ganti ke Mode Malam'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
