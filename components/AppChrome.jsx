'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

const dashboardRoutes = ['/dashboard', '/dashboard-imam', '/daftar-imam', '/jadwal', '/profile']

export default function AppChrome({ children }) {
  const pathname = usePathname()
  const isDashboardArea = dashboardRoutes.some((route) => (
    pathname === route || pathname.startsWith(`${route}/`)
  ))

  if (isDashboardArea) {
    return children
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}