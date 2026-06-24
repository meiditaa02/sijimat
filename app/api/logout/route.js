import { NextResponse } from 'next/server'

export async function GET(request) {
  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.delete('session')
  response.cookies.delete('session_role')
  return response
}
