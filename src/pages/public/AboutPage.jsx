import { Link } from 'react-router-dom'
import { BookOpen, Target, Users, Sparkles } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Konten Terstruktur',
      desc: 'Materi pembelajaran diorganisir dalam kategori, topik, dan artikel yang mudah diikuti.',
    },
    {
      icon: Target,
      title: 'Belajar Mandiri',
      desc: 'Dirancang untuk mendukung gaya belajar mandiri dengan kecepatan Anda sendiri.',
    },
    {
      icon: Users,
      title: 'Diperbarui Rutin',
      desc: 'Admin secara aktif menambahkan dan memperbarui konten untuk relevansi yang terjaga.',
    },
  ]

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-6">
          <Sparkles size={14} />
          Tentang Kami
        </div>
        <h1 className="section-title text-4xl mb-4">
          Apa itu <span className="text-gradient">Canxine-Zer0</span>?
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Canxine-Zer0 adalah platform pembelajaran pribadi yang menyediakan konten pendidikan
          dalam format yang terstruktur, mudah diakses, dan terus diperbarui.
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
          Platform ini dibangun dengan visi untuk menjadikan pembelajaran lebih mudah dan menyenangkan.
          Kami percaya bahwa setiap orang berhak mendapatkan akses ke pengetahuan berkualitas,
          kapan saja dan di mana saja.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Dengan menggunakan teknologi modern, Canxine-Zer0 menghadirkan pengalaman belajar
          yang intuitif dan bebas hambatan — dari kategori luas hingga artikel teknis yang mendalam.
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
