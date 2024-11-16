import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }

  try {
    const data = await verifyToken(token)
    console.log('Token verified:', data)
    return NextResponse.json({ isAuthenticated: true , userId : data.userId }, { status: 200 })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
}