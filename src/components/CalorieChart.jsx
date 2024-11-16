'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CalorieChart({ foodLogs }) {
  const processData = () => {
    const dailyCalories = foodLogs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += log.nutritionInfo.calories
      return acc
    }, {})

    return Object.entries(dailyCalories)
      .map(([date, calories]) => ({ date, calories }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7) // Get the last 7 days
  }

  const data = processData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Intake Over Time</CardTitle>
        <CardDescription>Your daily calorie consumption for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}