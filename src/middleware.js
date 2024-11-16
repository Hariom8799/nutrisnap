import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  try {
    await verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: ['/dashboard', '/profile', '/log-food'],
}