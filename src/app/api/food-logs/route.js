import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    await connectToDatabase()

    const foodLogs = await FoodLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean()

    return NextResponse.json(foodLogs)
  } catch (error) {
    console.error('Error fetching food logs:', error)
    return NextResponse.json({ error: 'Failed to fetch food logs' }, { status: 500 })
  }
}