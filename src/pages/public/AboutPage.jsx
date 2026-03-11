import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { BookOpen, Target, Users, Sparkles } from 'lucide-react'

import LoadingSpinner from '../../components/LoadingSpinner'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    about_header_title: '',
    about_header_highlight: '',
    about_header_subtitle: '',
    about_badge: '',
    feature_1_title: '',
    feature_1_desc: '',
    feature_2_title: '',
    feature_2_desc: '',
    feature_3_title: '',
    feature_3_desc: '',
    about_mission_1: '',
    about_mission_2: ''
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'about_header_title', 
          'about_header_highlight', 
          'about_header_subtitle', 
          'about_badge',
          'feature_1_title', 'feature_1_desc',
          'feature_2_title', 'feature_2_desc',
          'feature_3_title', 'feature_3_desc',
          'about_mission_1', 
          'about_mission_2'
        ])

      if (data && data.length > 0) {
        const settingsMap = {}
        data.forEach(item => {
          settingsMap[item.key] = item.value
        })
        setSettings(prev => ({ ...prev, ...settingsMap }))
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  if (loading) return <LoadingSpinner />

  const features = [
    {
      icon: BookOpen,
      title: settings.feature_1_title,
      desc: settings.feature_1_desc,
    },
    {
      icon: Target,
      title: settings.feature_2_title,
      desc: settings.feature_2_desc,
    },
    {
      icon: Users,
      title: settings.feature_3_title,
      desc: settings.feature_3_desc,
    },
  ]

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-6">
          <Sparkles size={14} />
          {settings.about_badge}
        </div>
        <h1 className="section-title text-4xl mb-4">
          {settings.about_header_title} <span className="text-gradient">{settings.about_header_highlight}</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {settings.about_header_subtitle}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <Icon size={22} className="text-brand-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Misi */}
      <div className="glass-card p-8 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Misi Kami</h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          {settings.about_mission_1}
        </p>
        <p className="text-slate-400 leading-relaxed">
          {settings.about_mission_2}
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/" className="btn-primary text-base py-3 px-8">
          Mulai Belajar Sekarang
        </Link>
      </div>
    </div>
  )
}
