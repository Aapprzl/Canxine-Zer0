import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Settings, Save, Loader2 } from 'lucide-react'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    hero_subtitle: '',
    hero_badge: '',
    about_header_title: '',
    about_header_highlight: '',
    about_header_subtitle: '',
    about_badge: '',
    about_badge: '',
    feature_1_title: '',
    feature_1_desc: '',
    feature_2_title: '',
    feature_2_desc: '',
    feature_3_title: '',
    feature_3_desc: '',
    about_mission_1: '',
    about_mission_2: '',
    footer_description: '',
    footer_email: '',
    footer_phone: '',
    footer_copyright: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('site_settings').select('key, value')
    
    if (error) {
      setError(error.message)
    } else if (data) {
      const settingsMap = {}
      data.forEach(item => {
        settingsMap[item.key] = item.value
      })
      setSettings(prev => ({ ...prev, ...settingsMap }))
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMsg('')

    // Prepare data for upsert
    const updates = Object.keys(settings).map(key => ({
      key,
      value: settings[key],
      updated_at: new Date().toISOString()
    }))

    const { error: upsertError } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' })

    if (upsertError) {
      setError(upsertError.message)
    } else {
      setSuccessMsg('Pengaturan berhasil disimpan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-slate-400">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan Situs</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola konten statis pada halaman publik</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          {error && (
            <div className="m-6 mb-0 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="m-6 mb-0 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Bagian Hero / Beranda */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Halaman Beranda (Hero)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Teks Pembuka</label>
                  <input 
                    type="text" 
                    name="hero_title" 
                    value={settings.hero_title} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Selamat Datang di"
                  />
                </div>
                <div>
                  <label className="label">Teks Sorotan (Gradient)</label>
                  <input 
                    type="text" 
                    name="hero_title_highlight" 
                    value={settings.hero_title_highlight} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Canxine-Zer0"
                  />
                </div>
              </div>

              <div>
                <label className="label">Deskripsi Singkat (Subtitle)</label>
                <textarea 
                  name="hero_subtitle" 
                  value={settings.hero_subtitle} 
                  onChange={handleChange} 
                  rows={2} 
                  className="input-field resize-none" 
                  placeholder="Deskripsi singkat di bawah judul..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Teks Pembuka (Badge)</label>
                  <input 
                    type="text" 
                    name="hero_badge" 
                    value={settings.hero_badge} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Platform Pembelajaran Pribadi"
                  />
                </div>
              </div>
            </div>

            {/* Bagian Tentang Kami */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Halaman Tentang Kami</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Teks Badge (Label Atas)</label>
                  <input 
                    type="text" 
                    name="about_badge" 
                    value={settings.about_badge} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Tentang Kami"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Teks Header</label>
                  <input 
                    type="text" 
                    name="about_header_title" 
                    value={settings.about_header_title} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Apa itu"
                  />
                </div>
                <div>
                  <label className="label">Teks Sorotan (Gradient)</label>
                  <input 
                    type="text" 
                    name="about_header_highlight" 
                    value={settings.about_header_highlight} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: Canxine-Zer0?"
                  />
                </div>
              </div>

              <div>
                <label className="label">Deskripsi Header</label>
                <textarea 
                  name="about_header_subtitle" 
                  value={settings.about_header_subtitle} 
                  onChange={handleChange} 
                  rows={2} 
                  className="input-field resize-none" 
                  placeholder="Canxine-Zer0 adalah platform..."
                />
              </div>
              
              
              {/* Fitur 1 */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Kotak Fitur 1</h3>
                <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="label">Judul Fitur 1</label>
                    <input 
                      type="text" 
                      name="feature_1_title" 
                      value={settings.feature_1_title} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Contoh: Konten Terstruktur"
                    />
                  </div>
                  <div>
                    <label className="label">Deskripsi Fitur 1</label>
                    <textarea 
                      name="feature_1_desc" 
                      value={settings.feature_1_desc} 
                      onChange={handleChange} 
                      rows={2} 
                      className="input-field resize-none" 
                      placeholder="Materi pembelajaran diorganisir..."
                    />
                  </div>
                </div>
              </div>

              {/* Fitur 2 */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Kotak Fitur 2</h3>
                <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="label">Judul Fitur 2</label>
                    <input 
                      type="text" 
                      name="feature_2_title" 
                      value={settings.feature_2_title} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Contoh: Belajar Mandiri"
                    />
                  </div>
                  <div>
                    <label className="label">Deskripsi Fitur 2</label>
                    <textarea 
                      name="feature_2_desc" 
                      value={settings.feature_2_desc} 
                      onChange={handleChange} 
                      rows={2} 
                      className="input-field resize-none" 
                      placeholder="Dirancang untuk mendukung..."
                    />
                  </div>
                </div>
              </div>

              {/* Fitur 3 */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Kotak Fitur 3</h3>
                <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="label">Judul Fitur 3</label>
                    <input 
                      type="text" 
                      name="feature_3_title" 
                      value={settings.feature_3_title} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Contoh: Diperbarui Rutin"
                    />
                  </div>
                  <div>
                    <label className="label">Deskripsi Fitur 3</label>
                    <textarea 
                      name="feature_3_desc" 
                      value={settings.feature_3_desc} 
                      onChange={handleChange} 
                      rows={2} 
                      className="input-field resize-none" 
                      placeholder="Admin secara aktif menambahkan..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <label className="label">Misi / Paragraf 1</label>
                <textarea 
                  name="about_mission_1" 
                  value={settings.about_mission_1} 
                  onChange={handleChange} 
                  rows={3} 
                  className="input-field resize-y" 
                  placeholder="Teks misi paragraf pertama..."
                />
              </div>
              
              <div>
                <label className="label">Misi / Paragraf 2</label>
                <textarea 
                  name="about_mission_2" 
                  value={settings.about_mission_2} 
                  onChange={handleChange} 
                  rows={3} 
                  className="input-field resize-y" 
                  placeholder="Teks misi paragraf kedua..."
                />
              </div>
            </div>

            {/* Bagian Bawah (Footer) */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Bagian Bawah (Footer)</h2>

              <div>
                <label className="label">Deskripsi Singkat Web (Bawah Logo)</label>
                <textarea 
                  name="footer_description" 
                  value={settings.footer_description} 
                  onChange={handleChange} 
                  rows={2} 
                  className="input-field resize-none" 
                  placeholder="Canxine-Zer0 adalah platform..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Kontak</label>
                  <input 
                    type="email" 
                    name="footer_email" 
                    value={settings.footer_email} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: hallow@canxine.com"
                  />
                </div>
                <div>
                  <label className="label">Nomor WhatsApp / Telepon</label>
                  <input 
                    type="text" 
                    name="footer_phone" 
                    value={settings.footer_phone} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Contoh: +62 812-3456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="label">Teks Hak Cipta (Copyright)</label>
                <input 
                  type="text" 
                  name="footer_copyright" 
                  value={settings.footer_copyright} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Contoh: Canxine-Zer0. All rights reserved."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving} 
                className="btn-primary w-full md:w-auto px-8 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save size={18} /> Simpan Pengaturan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
