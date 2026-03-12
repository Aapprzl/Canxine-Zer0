import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Mail, Phone, Code2 } from 'lucide-react'

export default function Footer() {
  const [settings, setSettings] = useState({
    footer_description: 'Platform Pembelajaran Pribadi',
    footer_email: '',
    footer_phone: '',
    footer_copyright: 'Canxine-Zer0. All rights reserved.'
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['footer_description', 'footer_email', 'footer_phone', 'footer_copyright'])

      if (data && data.length > 0) {
        const settingsMap = {}
        data.forEach(item => {
          settingsMap[item.key] = item.value
        })
        setSettings(prev => ({ ...prev, ...settingsMap }))
      }
    }
    fetchSettings()
  }, [])

  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {isHomePage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Description (lg:col-span-5) */}
          <div className="lg:col-span-5">
<Link to="/" className="inline-block mb-6 group/logo">
            <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight transition-colors group-hover/logo:text-brand-500">
              Canxine-Zer0
            </span>
          </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm transition-colors">
              {settings.footer_description}
            </p>
            
            {(settings.footer_email || settings.footer_phone) && (
              <div className="space-y-3">
                {settings.footer_email && (
                  <a href={`mailto:${settings.footer_email}`} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group">
                    <div className="p-2 rounded-lg bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 group-hover:border-brand-500/30 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium">{settings.footer_email}</span>
                  </a>
                )}
                {settings.footer_phone && (
                  <a href={`https://wa.me/${settings.footer_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group">
                    <div className="p-2 rounded-lg bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 group-hover:border-brand-500/30 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium">{settings.footer_phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Development Stack (lg:col-span-7) */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="flex items-center gap-2 mb-6">
              <Code2 size={20} className="text-brand-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Development Stack</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Box 1: Tools & Environment */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Tools & Editors</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-slate-600 dark:text-slate-400">VS Code</li>
                    <li className="text-sm text-slate-600 dark:text-slate-400">Google Antigravity</li>
                    <li className="text-sm text-slate-600 dark:text-slate-400">Sublime Text</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Powered by AI Technology</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Anthropic</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>ChatGPT</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>Gemini</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>Copilot</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>DeepSeek</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Box 2: Infrastructure */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Backend & Infrastructure</h4>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-600 dark:text-slate-400">Supabase Backend</li>
                  <li className="text-sm text-slate-600 dark:text-slate-400">Google Cloud Console</li>
                  <li className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">Git <span className="text-slate-300 dark:text-slate-600">/</span> Github</li>
                  <li className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">Node.js <span className="text-slate-300 dark:text-slate-600">/</span> React</li>
                  <li className="text-sm text-slate-600 dark:text-slate-400">Vercel</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Bottom Bar: Copyright (Always Shows) */}
        <div className={`pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${isHomePage ? 'border-t border-slate-200 dark:border-slate-800' : ''}`}>
          <p className="text-xs text-slate-500 font-medium">
            © {currentYear} {settings.footer_copyright}
          </p>
          <div className="flex gap-4 text-xs font-medium text-slate-500">
            <Link to="/tentang" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Tentang Kami</Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Admin Area</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
