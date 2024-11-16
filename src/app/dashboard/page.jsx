'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalorieChart } from '@/components/CalorieChart'
import { NutrientBreakdown } from '@/components/NutrientBreakdown'
import { FoodLogList } from '@/components/FoodLogList'
import { DailyProgressWidget } from '@/components/DailyProgressWidget'
import { RemainingCalories } from '@/components/RemainingCalories'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null)
  const [foodLogs, setFoodLogs] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchFoodLogs()
      fetchUserProfile()
    }
  }, [isAuthenticated, userId])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
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

  const fetchFoodLogs = async () => {
    try {
      const response = await fetch(`/api/food-logs?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch food logs')
      const data = await response.json()
      setFoodLogs(data)
    } catch (error) {
      console.error('Error fetching food logs:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch food logs',
        variant: 'destructive',
      })
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else if (response.status === 404) {
        setUserProfile(null)
      } else {
        throw new Error('Failed to fetch user profile')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch user profile',
        variant: 'destructive',
      })
    }
  }

  const calculateDailyTotals = () => {
    const today = new Date().toDateString()
    const todayLogs = foodLogs.filter(log => new Date(log.timestamp).toDateString() === today)
    return todayLogs.reduce((totals, log) => {
      totals.calories += log.nutritionInfo.calories
      totals.protein += log.nutritionInfo.protein
      totals.carbs += log.nutritionInfo.carbs
      totals.fat += log.nutritionInfo.fat
      return totals
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  // const dailyTotals = calculateDailyTotals()

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Not Set</AlertTitle>
          <AlertDescription>
            Please set up your profile to use the dashboard.
            <Button 
              className="mt-4 w-full" 
              onClick={() => router.push('/profile')}
            >
              Set Up Profile
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const dailyTotals = calculateDailyTotals()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DailyProgressWidget
            caloriesConsumed={dailyTotals.calories}
            calorieGoal={userProfile.dailyCalorieGoal}
            nutrients={[
              { name: 'Protein', current: dailyTotals.protein, goal: (userProfile.dailyCalorieGoal * 0.3) / 4 },
              { name: 'Carbs', current: dailyTotals.carbs, goal: (userProfile.dailyCalorieGoal * 0.5) / 4 },
              { name: 'Fat', current: dailyTotals.fat, goal: (userProfile.dailyCalorieGoal * 0.2) / 9 },
            ]}
          />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <RemainingCalories
            caloriesConsumed={dailyTotals.calories}
            calorieGoal={userProfile.dailyCalorieGoal}
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Calorie Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <CalorieChart foodLogs={foodLogs} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <NutrientBreakdown 
          dailyTotals={dailyTotals} 
          calorieGoal={userProfile.dailyCalorieGoal} 
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Food Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodLogList foodLogs={foodLogs} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard