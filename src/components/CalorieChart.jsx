'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CalorieChart({ foodLogs }) {
  const chartData = foodLogs.map(log => ({
    date: new Date(log.timestamp).toLocaleDateString(),
    calories: log.nutritionInfo.calories
  })).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Intake Over Time</CardTitle>
        <CardDescription>Your daily calorie consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}