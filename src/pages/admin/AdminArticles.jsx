import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useForm } from 'react-hook-form'
import ConfirmDialog from '../../components/ConfirmDialog'
import Pagination from '../../components/Pagination'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Plus, Pencil, Trash2, X, Save, Eye, Code2, ImagePlus, Loader2 } from 'lucide-react'

const PER_PAGE = 10

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function AdminArticles() {
  const [articles, setArticles] = useState([])
  const [topics, setTopics] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imgPreviewUrl, setImgPreviewUrl] = useState('')
  const fileInputRef = useRef()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const titleVal = watch('title', '')
  const contentVal = watch('content', '')

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

  const fetchTopics = async () => {
    const { data } = await supabase.from('topics').select('id, name, category_id, categories(name)').order('name')
    setTopics(data || [])
  }

  useEffect(() => {
    fetchArticles(currentPage)
    fetchTopics()
  }, [currentPage])

  useEffect(() => {
    if (!editing) setValue('slug', slugify(titleVal))
  }, [titleVal, editing])

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  const openForm = (article = null) => {
    setEditing(article)
    setServerError('')
    setPreviewMode(false)
    setImgPreviewUrl(article?.image_url || '')
    reset(article
      ? { title: article.title, slug: article.slug, content: article.content || '', topic_id: article.topic_id, author: article.author || '', published: article.published, image_url: article.image_url || '' }
      : { title: '', slug: '', content: '', topic_id: '', author: '', published: false, image_url: '' })
    setFormOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('article-images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName)
      setValue('image_url', urlData.publicUrl)
      setImgPreviewUrl(urlData.publicUrl)
    } else {
      setServerError('Gagal upload gambar: ' + error.message)
    }
    setUploadingImg(false)
  }

  const onSubmit = async (values) => {
    setSaving(true)
    setServerError('')
    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content || null,
      topic_id: parseInt(values.topic_id),
      author: values.author || null,
      image_url: values.image_url || null,
      published: values.published,
    }
    let error
    if (editing) {
      ({ error } = await supabase.from('articles').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('articles').insert(payload))
    }
    if (error) { setServerError(error.message) } else { setFormOpen(false); fetchArticles(currentPage) }
    setSaving(false)
  }

  const handleDelete = async () => {
    await supabase.from('articles').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchArticles(currentPage)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Artikel</h1>
          <p className="text-slate-400 text-sm">Kelola semua artikel pembelajaran</p>
        </div>
        <button onClick={() => openForm()} className="btn-primary">
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
                      <button onClick={() => openForm(a)} className="p-2 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 transition-all"><Pencil size={14} /></button>
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

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative glass-card w-full max-w-4xl p-6 shadow-2xl mb-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Artikel' : 'Tambah Artikel'}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} className="text-slate-400 hover:text-white" /></button>
            </div>
            {serverError && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">{serverError}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Judul <span className="text-red-400">*</span></label>
                  <input className={`input-field ${errors.title ? 'border-red-500' : ''}`} {...register('title', { required: 'Judul wajib diisi' })} />
                  {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="label">Slug <span className="text-red-400">*</span></label>
                  <input className={`input-field ${errors.slug ? 'border-red-500' : ''}`} {...register('slug', { required: 'Slug wajib diisi', pattern: { value: /^[a-z0-9-]+$/, message: 'Slug hanya huruf kecil, angka, tanda -' } })} />
                  {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
                </div>
                <div>
                  <label className="label">Topik <span className="text-red-400">*</span></label>
                  <select className={`input-field ${errors.topic_id ? 'border-red-500' : ''}`} {...register('topic_id', { required: 'Pilih topik' })}>
                    <option value="">-- Pilih Topik --</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.categories?.name} → {t.name}</option>
                    ))}
                  </select>
                  {errors.topic_id && <p className="mt-1 text-xs text-red-400">{errors.topic_id.message}</p>}
                </div>
                <div>
                  <label className="label">Penulis</label>
                  <input className="input-field" {...register('author')} placeholder="Nama penulis" />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="label">Gambar Artikel</label>
                <div className="flex items-start gap-3">
                  <div>
                    <input type="hidden" {...register('image_url')} />
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImg} className="btn-secondary text-sm py-2 px-4">
                      {uploadingImg ? <><Loader2 size={14} className="animate-spin" /> Mengupload...</> : <><ImagePlus size={14} /> Upload Gambar</>}
                    </button>
                    <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG, WebP. Maks 5MB.</p>
                  </div>
                  {imgPreviewUrl && (
                    <div className="relative">
                      <img src={imgPreviewUrl} alt="preview" className="w-24 h-16 object-cover rounded-lg border border-slate-600" />
                      <button type="button" onClick={() => { setValue('image_url', ''); setImgPreviewUrl('') }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content editor + preview toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Konten (Markdown)</label>
                  <div className="flex border border-slate-600 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => setPreviewMode(false)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${!previewMode ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      <Code2 size={12} /> Editor
                    </button>
                    <button type="button" onClick={() => setPreviewMode(true)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${previewMode ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      <Eye size={12} /> Preview
                    </button>
                  </div>
                </div>

                {previewMode ? (
                  <div className="min-h-48 bg-dark-700 border border-slate-600/50 rounded-xl p-4 prose prose-invert prose-sm max-w-none
                    prose-headings:text-white prose-p:text-slate-300 prose-a:text-brand-400 prose-code:text-accent-300
                    prose-code:bg-dark-800 prose-pre:bg-dark-800 prose-blockquote:border-brand-500 prose-li:text-slate-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentVal || '_Tidak ada konten._'}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    rows={10}
                    className="input-field resize-y font-mono text-sm"
                    placeholder="# Judul&#10;&#10;Tulis konten artikel dalam format **Markdown**..."
                    {...register('content')}
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" className="w-4 h-4 rounded accent-brand-500" {...register('published')} />
                <label htmlFor="published" className="text-sm text-slate-300 cursor-pointer">Publish artikel (tampilkan ke publik)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-700/50">
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2 px-4">Batal</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-4">
                  <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Yakin ingin menghapus artikel "${deleteTarget?.title}"? Data tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
