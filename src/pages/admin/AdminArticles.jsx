import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ConfirmDialog from '../../components/ConfirmDialog'
import Pagination from '../../components/Pagination'
import { Plus, Pencil, Trash2, Filter, Loader2 } from 'lucide-react'

const PER_PAGE = 10

export default function AdminArticles() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchTopics = async () => {
    const { data } = await supabase.from('topics').select('id, name, categories(name)').order('name')
    setTopics(data || [])
  }

  const fetchArticles = async (page = 1) => {
    setLoading(true)
    const from = (page - 1) * PER_PAGE
    const to = from + PER_PAGE - 1
    
    let query = supabase
      .from('articles')
      .select('*, topics(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    
    // Apply topic filter if selected
    if (selectedTopic) {
      query = query.eq('topic_id', parseInt(selectedTopic))
    }
    
    const { data, count } = await query
    setArticles(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage, selectedTopic])

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      // 1. Get all images to delete (main + content images)
      let filesToDelete = []
      
      // Main image
      if (deleteTarget.image_url) {
        const mainPathMatch = deleteTarget.image_url.split('article-images/')
        if (mainPathMatch.length > 1) filesToDelete.push(mainPathMatch[1])
      }

      // Content images (from hidden metadata)
      if (deleteTarget.content) {
        const metaMatch = deleteTarget.content.match(/<!-- CONTENT_IMAGES: (.*) -->/)
        if (metaMatch) {
          try {
            const contentImages = JSON.parse(metaMatch[1])
            contentImages.forEach(img => {
              const contentPathMatch = img.url.split('article-images/')
              if (contentPathMatch.length > 1) filesToDelete.push(contentPathMatch[1])
            })
          } catch (e) {
            console.error('Error parsing content images for cleanup', e)
          }
        }
      }

      // 2. Delete from storage if there are files
      if (filesToDelete.length > 0) {
        await supabase.storage.from('article-images').remove(filesToDelete)
      }

      // 3. Delete from database
      await supabase.from('articles').delete().eq('id', deleteTarget.id)
      
      setDeleteTarget(null)
      fetchArticles(currentPage)
    } catch (err) {
      console.error('Failed to delete article and its storage:', err)
      // Fallback: still delete DB entry if storage fails
      await supabase.from('articles').delete().eq('id', deleteTarget.id)
      setDeleteTarget(null)
      fetchArticles(currentPage)
    }
  }

return (
    <div className="p-8">
      {/* Filter & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Artikel</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Kelola semua artikel pembelajaran</p>
        </div>
        <button onClick={() => navigate('/admin/articles/new')} className="btn-primary">
          <Plus size={16} /> Tambah Artikel
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1) }}
            className="input-field py-2 text-sm min-w-[200px]"
          >
            <option value="">Semua Topik</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.categories?.name} → {t.name}</option>
            ))}
          </select>
        </div>
        {selectedTopic && (
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-dark-700 px-2 py-1 rounded">
            {totalCount} artikel
          </span>
)}
      </div>

{/* Table */}
      <div className="glass-card overflow-hidden mb-4 min-h-[300px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-dark-800/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-brand-500 animate-spin" />
              <p className="text-sm text-slate-500">Memuat...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="table-th">Judul</th>
                <th className="table-th">Topik</th>
                <th className="table-th">Penulis</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {!loading && articles.length === 0 && <tr><td colSpan={5} className="table-td text-center py-12 text-slate-500">Belum ada artikel.</td></tr>}
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="table-td font-medium text-slate-900 dark:text-white max-w-xs truncate transition-colors">{a.title}</td>
                  <td className="table-td text-slate-500 dark:text-slate-400 transition-colors">{a.topics?.name || '—'}</td>
                  <td className="table-td text-slate-500 dark:text-slate-400 transition-colors">{a.author || '—'}</td>
                  <td className="table-td">
                    <span className={a.published ? 'badge-green' : 'badge-gray'}>
                      {a.published ? 'Publik' : 'Draft'}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/admin/articles/edit/${a.id}`)} className="p-2 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 transition-all"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(a)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); setLoading(true) }} />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Yakin ingin menghapus artikel "${deleteTarget?.title}"? Data tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
