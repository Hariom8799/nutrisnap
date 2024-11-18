'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

// Dynamically import Image component with no SSR
const DynamicImage = dynamic(() => import('next/image'), { ssr: false })



export default function LogFood() {
  const [foodImage, setFoodImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [foodName, setFoodName] = useState('')
  const [nutritionInfo, setNutritionInfo] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
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
      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setFoodImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAnalyze = async () => {
    if (!foodImage) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', foodImage)

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze food')
      }

      const data = await response.json()
      setFoodName(data.foodName)

      // Fetch nutrition info
      const nutritionResponse = await fetch('/api/nutrition-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: data.foodName }),
      })
      if (!nutritionResponse.ok) throw new Error('Failed to fetch nutrition info')

      const nutritionData = await nutritionResponse.json()
      setNutritionInfo(nutritionData)
    } catch (error) {
      console.error('Error analyzing food:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze food',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFood = async () => {
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

      toast({
        title: 'Success',
        description: 'Food logged successfully',
      })

      // Reset form
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setFoodImage(null)
      setPreviewUrl('')
      setFoodName('')
      setNutritionInfo(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error logging food:', error)
      toast({
        title: 'Error',
        description: 'Failed to log food',
        variant: 'destructive',
      })
    }
  }

  const handleIgnore = () => {
    // Reset form
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setFoodImage(null)
    setPreviewUrl('')
    setFoodName('')
    setNutritionInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-4rem)] flex justify-center items-center p-4">
      <Card className="w-full">
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
          {previewUrl && (
            <div className="relative w-full h-48">
              <DynamicImage
                src={previewUrl}
                alt="Food preview"
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}
          <Button 
            onClick={handleAnalyze} 
            disabled={!foodImage || isLoading}
            className="w-full"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Food'}
          </Button>
          {foodName && (
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium">Detected Food: {foodName}</p>
            </div>
          )}
          {nutritionInfo && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Nutrition Information:</h3>
              <ul className="space-y-2">
                <li>Calories: {nutritionInfo.calories}</li>
                <li>Protein: {nutritionInfo.protein}g</li>
                <li>Carbs: {nutritionInfo.carbs}g</li>
                <li>Fat: {nutritionInfo.fat}g</li>
                <li>Serving Size: {nutritionInfo.serving_qty} {nutritionInfo.serving_unit}</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAddFood}
                  className="flex-1"
                >
                  Add to Eaten Meals
                </Button>
                <Button 
                  onClick={handleIgnore} 
                  variant="outline"
                  className="flex-1"
                >
                  Ignore
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useToast } from '@/hooks/use-toast'
// import Image from 'next/image'

// export default function LogFood() {
//   const [foodImage, setFoodImage] = useState(null)
//   const [foodName, setFoodName] = useState('')
//   const [confidence, setConfidence] = useState(0)
//   const [nutritionInfo, setNutritionInfo] = useState(null)
//   const [userId, setUserId] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const fileInputRef = useRef(null)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch('/api/auth/status')
//       if (response.ok) {
//         const data = await response.json()
//         setUserId(data.userId)
//       } else {
//         router.push('/auth/signin')
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error)
//       toast({
//         title: 'Error',
//         description: 'Failed to verify authentication',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setFoodImage(file)
//     }
//   }

//   const handleAnalyze = async () => {
//     if (!foodImage) return

//     setIsLoading(true)
//     try {
//       const formData = new FormData()
//       formData.append('file', foodImage)

//       const response = await fetch('/api/analyze-food', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to analyze food')
//       }

//       const data = await response.json()
//       setFoodName(data.foodName)
//       setConfidence(data.confidence)

//       // Fetch nutrition info
//       const nutritionResponse = await fetch('/api/nutrition-info', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: data.foodName }),
//       })
//       if (!nutritionResponse.ok) throw new Error('Failed to fetch nutrition info')

//       const nutritionData = await nutritionResponse.json()
//       setNutritionInfo(nutritionData)
//     } catch (error) {
//       console.error('Error analyzing food:', error)
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to analyze food',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleAddFood = async () => {
//     if (!userId || !nutritionInfo) return

//     try {
//       const response = await fetch('/api/log-food', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId,
//           foodName,
//           nutritionInfo,
//         }),
//       })

//       if (!response.ok) throw new Error('Failed to log food')

//       toast({
//         title: 'Success',
//         description: 'Food logged successfully',
//       })

//       // Reset form
//       setFoodImage(null)
//       setFoodName('')
//       setConfidence(0)
//       setNutritionInfo(null)
//       if (fileInputRef.current) fileInputRef.current.value = ''

//       // Redirect to dashboard
//       router.push('/dashboard')
//     } catch (error) {
//       console.error('Error logging food:', error)
//       toast({
//         title: 'Error',
//         description: 'Failed to log food',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleIgnore = () => {
//     // Reset form
//     setFoodImage(null)
//     setFoodName('')
//     setConfidence(0)
//     setNutritionInfo(null)
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   if (!userId) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="max-w-md mx-auto min-h-screen flex justify-center items-center">
//       <Card>
//         <CardHeader>
//           <CardTitle>Log Your Food</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="foodImage">Upload Food Image</Label>
//             <Input
//               id="foodImage"
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               ref={fileInputRef}
//             />
//           </div>
//           {foodImage && (
//             <div className="relative w-full h-48">
//               <Image 
//                 src={URL.createObjectURL(foodImage)} 
//                 alt="Food" 
//                 layout="fill" 
//                 objectFit="cover" 
//               />
//             </div>
//           )}
//           <Button onClick={handleAnalyze} disabled={!foodImage || isLoading}>
//             {isLoading ? 'Analyzing...' : 'Analyze Food'}
//           </Button>
//           {foodName && (
//             <div>
//               <p>Detected Food: {foodName}</p>
//               <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
//             </div>
//           )}
//           {nutritionInfo && (
//             <div>
//               <h3 className="font-bold">Nutrition Information:</h3>
//               <ul>
//                 <li>Calories: {nutritionInfo.calories}</li>
//                 <li>Protein: {nutritionInfo.protein}g</li>
//                 <li>Carbs: {nutritionInfo.carbs}g</li>
//                 <li>Fat: {nutritionInfo.fat}g</li>
//                 <li>Serving Size: {nutritionInfo.serving_qty} {nutritionInfo.serving_unit}</li>
//               </ul>
//               <div className="flex space-x-2 mt-4">
//                 <Button onClick={handleAddFood}>Add to Eaten Meals</Button>
//                 <Button onClick={handleIgnore} variant="outline">Ignore</Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }