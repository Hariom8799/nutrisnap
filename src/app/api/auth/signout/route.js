import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out successfully' }, { status: 200 })
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })

  return response
}