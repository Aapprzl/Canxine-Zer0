import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
