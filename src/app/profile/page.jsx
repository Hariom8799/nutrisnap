'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
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
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
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
    if (!profile.dailyCalorieGoal) newErrors.dailyCalorieGoal = 'Daily calorie goal is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch('/api/user-profile', {
        method: profile._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, userId: session.user.id }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        router.push('/dashboard')
      } else {
        toast({
          title: "Error",
          description: "Failed to save profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return <div>Please sign in to access your profile.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
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
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" value={profile.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } } )}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
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
              <Select name="activityLevel" value={profile.activityLevel} onValueChange={(value) => handleChange({ target: { name: 'activityLevel', value } } )}>
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
              <Select name="goal" value={profile.goal} onValueChange={(value) => handleChange({ target: { name: 'goal', value } } )}>
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
            <div>
              <Label htmlFor="dailyCalorieGoal">Daily Calorie Goal</Label>
              <Input
                id="dailyCalorieGoal"
                name="dailyCalorieGoal"
                type="number"
                value={profile.dailyCalorieGoal}
                onChange={handleChange}
                required
              />
              {errors.dailyCalorieGoal && <p className="text-red-500 text-sm mt-1">{errors.dailyCalorieGoal}</p>}
            </div>
            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}