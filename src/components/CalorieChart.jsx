'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { date: '2024-03-01', calories: 2100 },
  { date: '2024-03-02', calories: 1950 },
  { date: '2024-03-03', calories: 2200 },
  { date: '2024-03-04', calories: 2050 },
  { date: '2024-03-05', calories: 2150 },
  { date: '2024-03-06', calories: 2000 },
  { date: '2024-03-07', calories: 2100 },
]

export function CalorieChart() {
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