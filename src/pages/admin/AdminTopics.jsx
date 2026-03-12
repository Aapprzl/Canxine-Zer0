import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useForm } from 'react-hook-form'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import * as TablerIcons from '@tabler/icons-react'

const ICON_OPTIONS = [
  // Books / topics
  'IconBook',
  'IconBook2',
  'IconBooks',
  'IconBookOpen',
  'IconLibrary',
  'IconNotebook',

  // School / academic
  'IconSchool',
  'IconGraduationCap',
  'IconCertificate',

  // Notes / writing / tasks
  'IconClipboard',
  'IconPencil',
  'IconPen',
  'IconEdit',
  'IconFileText',
  'IconFileCheck',
  'IconFilePlus',
  'IconListCheck',

  // Thinking / learning
  'IconBrain',
  'IconBulb',
  'IconTarget',
  'IconStar',

  // Achievement
  'IconAward',
  'IconMedal',
  'IconTrophy',
  'IconRibbon',

  // Subjects / science / language / art
  'IconMicroscope',
  'IconCalculator',
  'IconChartLine',
  'IconLanguage',
  'IconPalette',
  'IconMusic',
  'IconLeaf',
  'IconWorld',

  // Teaching / presentation
  'IconPresentation',

  // Tech learning / coding
  'IconCode',
  'IconTerminal',
  'IconBrandPython',
  'IconBrandJavascript',
  'IconBrandReact',
  'IconBrandHtml5',
  'IconBrandCss3',
  'IconBrandGithub',
  'IconDeviceLaptop',
  'IconDatabase',
  'IconApi',

  // Time / schedule
  'IconClock',
  'IconTimer',
  'IconCalendar',
  'IconHistory',

  // UI basic (boleh dipakai di dashboard belajar)
  'IconSearch',
  'IconFilter',
  'IconSettings',
  'IconEye',
  'IconFolder',
  'IconFile'
]

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function AdminTopics() {
  const [topics, setTopics] = useState([])
  const [categories, setCategories] = useState([])
  const [filterCat, setFilterCat] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const [iconSearch, setIconSearch] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const nameVal = watch('name', '')

  const fetchData = async () => {
    const [{ data: cats }, { data: tops }] = await Promise.all([
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('topics').select('*, categories(name)').order('created_at', { ascending: true }),
    ])
    setCategories(cats || [])
    setTopics(tops || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (!editing) setValue('slug', slugify(nameVal))
  }, [nameVal, editing])

  const filtered = filterCat ? topics.filter(t => String(t.category_id) === filterCat) : topics

  const openForm = (topic = null) => {
    setEditing(topic)
    setServerError('')
    setIconSearch('')
    reset(topic
      ? { name: topic.name, slug: topic.slug, description: topic.description || '', category_id: topic.category_id, icon: topic.icon || 'IconBook' }
      : { name: '', slug: '', description: '', category_id: '', icon: 'IconBook' })
    setFormOpen(true)
  }

  const onSubmit = async (values) => {
    setSaving(true)
    setServerError('')
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      category_id: parseInt(values.category_id),
      icon: values.icon || null,
    }
    let error
    if (editing) {
      ({ error } = await supabase.from('topics').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('topics').insert(payload))
    }
    if (error) { setServerError(error.message) } else { setFormOpen(false); fetchData() }
    setSaving(false)
  }

  const handleDelete = async () => {
    await supabase.from('topics').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Topik</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Kelola semua topik pembelajaran</p>
        </div>
        <button onClick={() => openForm()} className="btn-primary">
          <Plus size={16} /> Tambah Topik
        </button>
      </div>

      {/* Filter */}
      <div className="mb-5">
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="table-th">Icon</th>
                <th className="table-th">Nama</th>
                <th className="table-th">Slug</th>
                <th className="table-th">Kategori</th>
                <th className="table-th">Deskripsi</th>
                <th className="table-th text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading && <tr><td colSpan={6} className="table-td text-center py-12 text-slate-500">Memuat...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="table-td text-center py-12 text-slate-500">Belum ada topik.</td></tr>}
              {filtered.map(t => {
                const iconName = t.icon || 'IconBook'
                const IconComponent = TablerIcons[iconName] || TablerIcons.IconBook
                return (
                <tr key={t.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="table-td">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                      <IconComponent size={16} className="text-brand-400" />
                    </div>
                  </td>
                  <td className="table-td font-medium text-slate-900 dark:text-white transition-colors">{t.name}</td>
                  <td className="table-td transition-colors">
                    <code className="text-xs text-accent-600 dark:text-accent-400 bg-slate-100 dark:bg-dark-700 px-2 py-0.5 rounded transition-colors">
                      {t.slug}
                    </code>
                  </td>
                  <td className="table-td text-slate-500 dark:text-slate-400 transition-colors">{t.categories?.name || '—'}</td>
                  <td className="table-td text-slate-500 dark:text-slate-400 max-w-xs truncate transition-colors">{t.description || '—'}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openForm(t)} className="p-2 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 transition-all"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-card w-full max-w-3xl p-6 shadow-2xl transition-colors" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{editing ? 'Edit Topik' : 'Tambah Topik'}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" /></button>
            </div>
            {serverError && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">{serverError}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <label className="label">Kategori <span className="text-red-400">*</span></label>
                  <select className={`input-field ${errors.category_id ? 'border-red-500' : ''}`} {...register('category_id', { required: 'Pilih kategori' })}>
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.category_id && <p className="mt-1 text-xs text-red-400">{errors.category_id.message}</p>}
                </div>
                <div className="mb-4">
                  <label className="label">Nama <span className="text-red-400">*</span></label>
                  <input className={`input-field ${errors.name ? 'border-red-500' : ''}`} {...register('name', { required: 'Nama wajib diisi' })} />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                  <label className="label">Slug <span className="text-red-400">*</span></label>
                  <input className={`input-field ${errors.slug ? 'border-red-500' : ''}`} {...register('slug', { required: 'Slug wajib diisi', pattern: { value: /^[a-z0-9-]+$/, message: 'Slug hanya boleh huruf kecil, angka, dan tanda -' } })} />
                  {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
                </div>
                <div>
                  <label className="label">Deskripsi</label>
                  <textarea rows={3} className="input-field resize-none" {...register('description')} />
                </div>
              </div>
              <div>
                <label className="label">Icon</label>
                <div className="grid grid-cols-6 gap-1.5 max-h-56 overflow-y-auto p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  {ICON_OPTIONS.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase())).map(iconName => {
                    const IconComponent = TablerIcons[iconName] || TablerIcons.IconBook
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setValue('icon', iconName)}
                        className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                          watch('icon') === iconName
                            ? 'bg-brand-500 text-white'
                            : 'bg-white dark:bg-slate-700 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <IconComponent size={16} />
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Cari icon..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="input-field text-sm py-1.5 flex-1"
                  />
                  <span className="text-xs text-slate-500">Icon: <span className="font-medium text-brand-600 dark:text-brand-400">{watch('icon')?.replace('Icon', '') || 'Book'}</span></span>
                </div>
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Yakin ingin menghapus topik "${deleteTarget?.name}"? Semua artikel di dalamnya juga akan terhapus.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
