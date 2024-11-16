import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    await dbConnect()

    const { name, email, password } = await request.json()

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Sign-up error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}