'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

export default function Profile() {
  const router = useRouter()
  const { toast } = useToast()
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    dailyCalorieGoal: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        setUserId(data.userId)
        fetchProfile(data.userId)
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

  const fetchProfile = async (id) => {
    try {
      const response = await fetch(`/api/user-profile?userId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch profile',
        variant: 'destructive',
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!profile.age) newErrors.age = 'Age is required'
    if (!profile.gender) newErrors.gender = 'Gender is required'
    if (!profile.height) newErrors.height = 'Height is required'
    if (!profile.weight) newErrors.weight = 'Weight is required'
    if (!profile.activityLevel) newErrors.activityLevel = 'Activity level is required'
    if (!profile.goal) newErrors.goal = 'Goal is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateBMR = () => {
    const weight = parseFloat(profile.weight)
    const height = parseFloat(profile.height)
    const age = parseInt(profile.age)

    if (profile.gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
  }

  const calculateTDEE = (bmr) => {
    const activityFactors = {
      sedentary: 1.2,
      'lightly active': 1.375,
      'moderately active': 1.55,
      'very active': 1.725,
      'extra active': 1.9,
    }
    return bmr * activityFactors[profile.activityLevel]
  }

  const calculateDailyCalorieGoal = () => {
    const bmr = calculateBMR()
    const tdee = calculateTDEE(bmr)
    let goalCalories = tdee

    if (profile.goal === 'lose weight') {
      goalCalories -= 500 // Create a calorie deficit
    } else if (profile.goal === 'gain weight') {
      goalCalories += 500 // Create a calorie surplus
    }

    return Math.round(goalCalories)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const calculatedCalories = calculateDailyCalorieGoal()
    const updatedProfile = { ...profile, dailyCalorieGoal: calculatedCalories }

    try {
      const response = await fetch('/api/user-profile', {
        method: profile._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedProfile, userId }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        })
        router.push('/dashboard')
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile & Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                required
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" value={profile.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
                required
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleChange}
                required
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select name="activityLevel" value={profile.activityLevel} onValueChange={(value) => handleChange({ target: { name: 'activityLevel', value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightly active">Lightly Active</SelectItem>
                  <SelectItem value="moderately active">Moderately Active</SelectItem>
                  <SelectItem value="very active">Very Active</SelectItem>
                  <SelectItem value="extra active">Extra Active</SelectItem>
                </SelectContent>
              </Select>
              {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel}</p>}
            </div>
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Select name="goal" value={profile.goal} onValueChange={(value) => handleChange({ target: { name: 'goal', value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose weight">Lose Weight</SelectItem>
                  <SelectItem value="maintain weight">Maintain Weight</SelectItem>
                  <SelectItem value="gain weight">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
              {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full">Save Profile</Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}