import { NextResponse } from 'next/server'
import  connectToDatabase  from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'

export async function POST(request) {
  try {
    const { userId, foodName, nutritionInfo, imageUrl } = await request.json()

    await connectToDatabase()

    const newFoodLog = new FoodLog({
      userId,
      foodName,
      nutritionInfo,
      imageUrl,
    })

    await newFoodLog.save()

    return NextResponse.json({ success: true, id: newFoodLog._id })
  } catch (error) {
    console.error('Error logging food:', error)
    return NextResponse.json({ error: 'Failed to log food' }, { status: 500 })
  }
}