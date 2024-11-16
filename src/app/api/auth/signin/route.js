import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyPassword, createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    const token = await createToken({ userId: user._id.toString() })

    const response = NextResponse.json({ message: 'Authentication successful' }, { status: 200 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}