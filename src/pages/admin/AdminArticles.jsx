import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ConfirmDialog from '../../components/ConfirmDialog'
import Pagination from '../../components/Pagination'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const PER_PAGE = 10

export default function AdminArticles() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchArticles = async (page = 1) => {
    const from = (page - 1) * PER_PAGE
    const to = from + PER_PAGE - 1
    const { data, count } = await supabase
      .from('articles')
      .select('*, topics(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    setArticles(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage])

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Artikel</h1>
          <p className="text-slate-400 text-sm">Kelola semua artikel pembelajaran</p>
        </div>
        <button onClick={() => navigate('/admin/articles/new')} className="btn-primary">
          <Plus size={16} /> Tambah Artikel
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden mb-4">
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
              {loading && <tr><td colSpan={5} className="table-td text-center py-12 text-slate-500">Memuat...</td></tr>}
              {!loading && articles.length === 0 && <tr><td colSpan={5} className="table-td text-center py-12 text-slate-500">Belum ada artikel.</td></tr>}
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="table-td font-medium text-white max-w-xs truncate">{a.title}</td>
                  <td className="table-td text-slate-400">{a.topics?.name || '—'}</td>
                  <td className="table-td text-slate-400">{a.author || '—'}</td>
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
