import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Save, Eye, Code2, ImagePlus, Loader2, X, FileUp, Copy, Check, UploadCloud } from 'lucide-react'

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function AdminArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imgPreviewUrl, setImgPreviewUrl] = useState('')
  const fileInputRef = useRef()
  const contentImagesRef = useRef()
  const mdInputRef = useRef()

  const [contentImages, setContentImages] = useState([])
  const [uploadingContent, setUploadingContent] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      topic_id: '',
      author: '',
      published: false,
      image_url: '',
      description: ''
    }
  })

  const titleVal = watch('title', '')
  const contentVal = watch('content', '')

  const fetchTopics = async () => {
    const { data } = await supabase.from('topics').select('id, name, category_id, categories(name)').order('name')
    setTopics(data || [])
  }

  const fetchArticle = async () => {
    if (!id) return
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      setServerError('Gagal memuat artikel: ' + error.message)
    } else if (data) {
      reset({
        title: data.title,
        slug: data.slug,
        content: data.content || '',
        topic_id: data.topic_id,
        author: data.author || '',
        published: data.published,
        image_url: data.image_url || '',
        description: data.description || ''
      })
      setImgPreviewUrl(data.image_url || '')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTopics()
    if (isEditing) fetchArticle()
  }, [id])

  useEffect(() => {
    if (!isEditing && titleVal) {
      setValue('slug', slugify(titleVal))
    }
  }, [titleVal, isEditing, setValue])

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

  const handleContentImagesUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingContent(true)
    const newImages = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `content-img/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      
      const { error } = await supabase.storage.from('article-images').upload(fileName, file)
      
      if (!error) {
        const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName)
        newImages.push({
          url: urlData.publicUrl,
          name: file.name
        })
      }
    }

    setContentImages(prev => [...prev, ...newImages])
    setUploadingContent(false)
    e.target.value = ''
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleMarkdownImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result
      setValue('content', content)
    }
    reader.readAsText(file)
    // Reset input so the same file can be uploaded again if needed
    e.target.value = ''
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
      description: values.description || null,
      published: values.published,
    }

    let error
    if (isEditing) {
      ({ error } = await supabase.from('articles').update(payload).eq('id', id))
    } else {
      ({ error } = await supabase.from('articles').insert(payload))
    }

    if (error) {
      setServerError(error.message)
    } else {
      navigate('/admin/articles')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-slate-400">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/articles" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h1>
            <p className="text-slate-400 text-sm">Kembali ke daftar artikel</p>
          </div>
        </div>

        <div className="glass-card p-6 shadow-2xl">
          {serverError && (
            <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Judul <span className="text-red-400">*</span></label>
                <input 
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`} 
                  {...register('title', { required: 'Judul wajib diisi' })} 
                  placeholder="Masukkan judul artikel"
                />
                {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label">Slug <span className="text-red-400">*</span></label>
                <input 
                  className={`input-field ${errors.slug ? 'border-red-500' : ''}`} 
                  {...register('slug', { 
                    required: 'Slug wajib diisi', 
                    pattern: { value: /^[a-z0-9-]+$/, message: 'Slug hanya huruf kecil, angka, tanda -' } 
                  })} 
                  placeholder="judul-artikel-otomatis"
                />
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

            <div>
              <label className="label">Deskripsi Singkat <span className="text-slate-500 font-normal text-xs">(Muncul di halaman daftar artikel)</span></label>
              <textarea 
                rows={2} 
                className="input-field resize-none px-4 py-3" 
                {...register('description')} 
                placeholder="Tulis ringkasan singkat artikel di sini..."
              />
            </div>

            {/* Image upload */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <label className="label">Gambar Artikel</label>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <input type="hidden" {...register('image_url')} />
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploadingImg} 
                    className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {uploadingImg ? <><Loader2 size={18} className="animate-spin" /> Mengupload...</> : <><ImagePlus size={18} /> Pilih Gambar Utama</>}
                  </button>
                  <p className="text-xs text-slate-500 mt-2 text-center">Rekomendasi ukuran: 1200x630px. Maks 5MB.</p>
                </div>
                {imgPreviewUrl && (
                  <div className="relative group">
                    <img src={imgPreviewUrl} alt="preview" className="w-40 h-24 object-cover rounded-xl border border-slate-600 shadow-lg" />
                    <button 
                      type="button" 
                      onClick={() => { setValue('image_url', ''); setImgPreviewUrl('') }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content editor + preview toggle */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <label className="label mb-0">Konten Artikel (Markdown)</label>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Markdown Import */}
                  <input 
                    type="file" 
                    accept=".md,.txt" 
                    ref={mdInputRef} 
                    className="hidden" 
                    onChange={handleMarkdownImport} 
                  />
                  <button 
                    type="button" 
                    onClick={() => mdInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-400 border border-brand-500/30 rounded-lg hover:bg-brand-500/10 transition-colors"
                  >
                    <FileUp size={14} /> Import .md
                  </button>

                  <div className="flex border border-slate-600 rounded-lg overflow-hidden shrink-0">
                    <button type="button" onClick={() => setPreviewMode(false)}
                      className={`flex items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${!previewMode ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      <Code2 size={14} /> Editor
                    </button>
                    <button type="button" onClick={() => setPreviewMode(true)}
                      className={`flex items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${previewMode ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                </div>
              </div>

              {previewMode ? (
                <div className="h-[600px] overflow-y-auto bg-dark-800/50 border border-slate-700/50 rounded-xl p-8 prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-p:text-slate-300 prose-a:text-brand-400 prose-code:text-accent-300
                  prose-code:bg-dark-900 prose-pre:bg-dark-900 prose-blockquote:border-brand-500 prose-li:text-slate-300 shadow-inner">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentVal || '*Konten kosong. Silakan tulis sesuatu...*'}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className="input-field resize-none font-mono text-sm h-[600px] p-6"
                  placeholder="# Judul Artikel&#10;&#10;Tulis isi artikel Anda dengan format Markdown di sini...&#10;&#10;Gunakan toolbar di atas untuk melihat preview."
                  {...register('content')}
                />
              )}
            </div>

            {/* Content Image Manager */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Manager Gambar Konten</h3>
                  <p className="text-xs text-slate-500">Upload gambar untuk digunakan dalam isi artikel</p>
                </div>
                <div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={contentImagesRef} 
                    className="hidden" 
                    onChange={handleContentImagesUpload} 
                  />
                  <button 
                    type="button" 
                    onClick={() => contentImagesRef.current?.click()}
                    disabled={uploadingContent}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"
                  >
                    {uploadingContent ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                    Upload Gambar
                  </button>
                </div>
              </div>

              <div className="p-4">
                {contentImages.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm italic">
                    Belum ada gambar konten yang diupload
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {contentImages.map((img, idx) => {
                      const mdCode = `![${img.name}](${img.url})`
                      return (
                        <div key={idx} className="relative group aspect-square rounded-lg border border-slate-700 overflow-hidden bg-dark-900">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" title={img.name} />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2 text-center text-[10px]">
                            <button 
                              type="button"
                              onClick={() => copyToClipboard(mdCode, idx)}
                              className="w-full btn-primary py-1 px-1 flex items-center justify-center gap-1"
                            >
                              {copiedIndex === idx ? <Check size={10} /> : <Copy size={10} />}
                              {copiedIndex === idx ? 'Copied' : 'Copy MD'}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setContentImages(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-800/20 rounded-xl border border-slate-700/50">
              <input type="checkbox" id="published" className="w-5 h-5 rounded accent-brand-500 cursor-pointer" {...register('published')} />
              <div className="cursor-pointer" onClick={() => setValue('published', !watch('published'))}>
                <label htmlFor="published" className="text-sm font-medium text-white cursor-pointer block">Publikasikan Artikel</label>
                <p className="text-xs text-slate-400">Jika aktif, artikel akan langsung terlihat oleh pengunjung website.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
              <Link to="/admin/articles" className="btn-secondary px-6">Batal</Link>
              <button type="submit" disabled={saving} className="btn-primary px-8 flex items-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
