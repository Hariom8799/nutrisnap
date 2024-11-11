import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
  }
}