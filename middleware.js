import { NextResponse } from 'next/server'

export function middleware(request) {
  const session = request.cookies.get('session')
  const role = request.cookies.get('session_role')?.value
  const pathname = request.nextUrl.pathname

  const dashboardByRole = {
    admin: '/dashboard',
    imam: '/dashboard-imam',
    user: '/dashboard-user',
  }

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL(dashboardByRole[role] || '/dashboard-user', request.url))
  }

  if (pathname === '/login') {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isAdminDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  if (isAdminDashboard && role !== 'admin') {
    return NextResponse.redirect(new URL(dashboardByRole[role] || '/dashboard-user', request.url))
  }

  const isImamDashboard = pathname === '/dashboard-imam' || pathname.startsWith('/dashboard-imam/')
  if (isImamDashboard && role !== 'imam') {
    return NextResponse.redirect(new URL(dashboardByRole[role] || '/dashboard-user', request.url))
  }

  const isUserDashboard = pathname === '/dashboard-user' || pathname.startsWith('/dashboard-user/')
  if (isUserDashboard && role !== 'user') {
    return NextResponse.redirect(new URL(dashboardByRole[role] || '/dashboard-user', request.url))
  }

  // Halaman daftar imam hanya untuk role imam/admin
  if (pathname.startsWith('/daftar-imam') && role !== 'imam' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard-user', request.url))
  }

  return NextResponse.next()
}

// Proteksi /dashboard DAN /daftar-imam
export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/dashboard-user',
    '/dashboard-user/:path*',
    '/dashboard-imam',
    '/dashboard-imam/:path*',
    '/daftar-imam',
    '/daftar-imam/:path*',
    '/profile',
    '/profile/:path*',
  ],
}
