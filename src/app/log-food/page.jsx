'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function LogFood() {
  const [foodImage, setFoodImage] = useState(null)
  const [foodName, setFoodName] = useState('')
  const [nutritionInfo, setNutritionInfo] = useState(null)
  const fileInputRef = useRef(null)
  const { data: session } = useSession()

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoodImage(reader.result )
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!foodImage) return

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: foodImage }),
      })

      if (!response.ok) throw new Error('Failed to analyze food')

      const data = await response.json()
      setFoodName(data.foodName)

      // Fetch nutrition info
      const nutritionResponse = await fetch(`/api/nutrition-info?food=${data.foodName}`)
      if (!nutritionResponse.ok) throw new Error('Failed to fetch nutrition info')

      const nutritionData = await nutritionResponse.json()
      setNutritionInfo(nutritionData)
    } catch (error) {
      console.error('Error analyzing food:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleConfirm = async () => {
    if (!session || !nutritionInfo) return

    try {
      const response = await fetch('/api/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          foodName,
          nutritionInfo,
        }),
      })

      if (!response.ok) throw new Error('Failed to log food')

      // Reset form and show success message
      setFoodImage(null)
      setFoodName('')
      setNutritionInfo(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      // Show success message to user
    } catch (error) {
      console.error('Error logging food:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Food</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="foodImage">Upload Food Image</Label>
            <Input
              id="foodImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </div>
          {foodImage && (
            <div className="relative w-full h-48">
              <Image src={foodImage} alt="Food" layout="fill" objectFit="cover" />
            </div>
          )}
          <Button onClick={handleAnalyze} disabled={!foodImage}>
            Analyze Food
          </Button>
          {foodName && (
            <div>
              <p>Detected Food: {foodName}</p>
            </div>
          )}
          {nutritionInfo && (
            <div>
              <h3 className="font-bold">Nutrition Information:</h3>
              <ul>
                <li>Calories: {nutritionInfo.calories}</li>
                <li>Protein: {nutritionInfo.protein}g</li>
                <li>Carbs: {nutritionInfo.carbs}g</li>
                <li>Fat: {nutritionInfo.fat}g</li>
              </ul>
              <Button onClick={handleConfirm}>Confirm Intake</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}