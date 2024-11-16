'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function LogFood() {
  const [foodImage, setFoodImage] = useState(null)
  const [foodName, setFoodName] = useState('')
  const [nutritionInfo, setNutritionInfo] = useState(null)
  const [userId, setUserId] = useState(null)
  const fileInputRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setUserId(data.userId)
      } else {
        router.push('/auth/signin')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      toast({
        title: 'Error',
        description: 'Failed to verify authentication',
        variant: 'destructive',
      })
    }
  }

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
      toast({
        title: 'Error',
        description: 'Failed to analyze food',
        variant: 'destructive',
      })
    }
  }

  const handleConfirm = async () => {
    if (!userId || !nutritionInfo) return

    try {
      const response = await fetch('/api/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
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
      toast({
        title: 'Success',
        description: 'Food logged successfully',
      })
    } catch (error) {
      console.error('Error logging food:', error)
      toast({
        title: 'Error',
        description: 'Failed to log food',
        variant: 'destructive',
      })
    }
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex justify-center items-center">
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