import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useForm } from 'react-hook-form'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const nameVal = watch('name', '')

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  // Auto-slug from name when creating
  useEffect(() => {
    if (!editing) setValue('slug', slugify(nameVal))
  }, [nameVal, editing])

  const openForm = (cat = null) => {
    setEditing(cat)
    setServerError('')
    reset(cat ? { name: cat.name, slug: cat.slug, description: cat.description || '' } : { name: '', slug: '', description: '' })
    setFormOpen(true)
  }

  const onSubmit = async (values) => {
    setSaving(true)
    setServerError('')
    const payload = { name: values.name, slug: values.slug, description: values.description || null }
    let error

    if (editing) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('categories').insert(payload))
    }

    if (error) {
      setServerError(error.message)
    } else {
      setFormOpen(false)
      fetchCategories()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    await supabase.from('categories').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchCategories()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Kategori</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Kelola semua kategori pembelajaran</p>
        </div>
        <button onClick={() => openForm()} className="btn-primary">
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="table-th">Nama</th>
                <th className="table-th">Slug</th>
                <th className="table-th">Deskripsi</th>
                <th className="table-th text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading && (
                <tr><td colSpan={4} className="table-td text-center py-12 text-slate-500">Memuat...</td></tr>
              )}
              {!loading && categories.length === 0 && (
                <tr><td colSpan={4} className="table-td text-center py-12 text-slate-500">Belum ada kategori.</td></tr>
              )}
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="table-td font-medium text-slate-900 dark:text-white transition-colors">{cat.name}</td>
                  <td className="table-td transition-colors">
                    <code className="text-xs text-accent-600 dark:text-accent-400 bg-slate-100 dark:bg-dark-700 px-2 py-0.5 rounded transition-colors">
                      {cat.slug}
                    </code>
                  </td>
                  <td className="table-td text-slate-500 dark:text-slate-400 max-w-xs truncate transition-colors">{cat.description || '—'}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openForm(cat)} className="p-2 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-card w-full max-w-lg p-6 shadow-2xl transition-colors" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" /></button>
            </div>

            {serverError && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nama <span className="text-red-400">*</span></label>
                <input className={`input-field ${errors.name ? 'border-red-500' : ''}`} {...register('name', { required: 'Nama wajib diisi' })} />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Slug <span className="text-red-400">*</span></label>
                <input className={`input-field ${errors.slug ? 'border-red-500' : ''}`} {...register('slug', { required: 'Slug wajib diisi', pattern: { value: /^[a-z0-9-]+$/, message: 'Slug hanya boleh huruf kecil, angka, dan tanda -' } })} />
                {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <textarea rows={3} className="input-field resize-none" {...register('description')} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2 px-4">Batal</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-4">
                  <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Yakin ingin menghapus kategori "${deleteTarget?.name}"? Semua topik dan artikel di dalamnya juga akan terhapus.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
