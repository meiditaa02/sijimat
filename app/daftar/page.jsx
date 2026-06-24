import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Daftar | SiJimat',
  description: 'Halaman ini dialihkan ke pendaftaran akun.',
}

export default function DaftarPage() {
  redirect('/register')
}
