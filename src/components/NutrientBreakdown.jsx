'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NutrientBreakdown({ dailyTotals, calorieGoal }) {
  // Calculate macronutrient goals based on calorie goal
  const proteinGoal = (calorieGoal * 0.3) / 4 // 30% of calories, 4 calories per gram
  const carbsGoal = (calorieGoal * 0.5) / 4   // 50% of calories, 4 calories per gram
  const fatGoal = (calorieGoal * 0.2) / 9     // 20% of calories, 9 calories per gram

  const data = [
    {
      name: 'Protein',
      consumed: Math.round(dailyTotals.protein),
      goal: Math.round(proteinGoal),
    },
    {
      name: 'Carbs',
      consumed: Math.round(dailyTotals.carbs),
      goal: Math.round(carbsGoal),
    },
    {
      name: 'Fat',
      consumed: Math.round(dailyTotals.fat),
      goal: Math.round(fatGoal),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrient Breakdown</CardTitle>
        <CardDescription>Comparison of consumed vs. goal macronutrients (in grams)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="consumed" fill="#8884d8" name="Consumed" />
            <Bar dataKey="goal" fill="#82ca9d" name="Goal" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}