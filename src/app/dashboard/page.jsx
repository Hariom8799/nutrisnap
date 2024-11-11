'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalorieChart } from '@/components/CalorieChart'
import { NutrientBreakdown } from '@/components/NutrientBreakdown'
import { FoodLogList } from '@/components/FoodLogList'

export default function Dashboard() {
  const { data: session } = useSession()
  const [foodLogs, setFoodLogs] = useState([])

  useEffect(() => {
    if (session?.user?.id) {
      fetchFoodLogs()
    }
  }, [session])

  const fetchFoodLogs = async () => {
    try {
      const response = await fetch(`/api/food-logs?userId=${session.user.id}`)
      if (!response.ok) throw new Error('Failed to fetch food logs')
      const data = await response.json()
      setFoodLogs(data)
    } catch (error) {
      console.error('Error fetching food logs:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calorie Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <CalorieChart foodLogs={foodLogs} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nutrient Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <NutrientBreakdown foodLogs={foodLogs} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Food Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <FoodLogList foodLogs={foodLogs} />
        </CardContent>
      </Card>
    </div>
  )
}