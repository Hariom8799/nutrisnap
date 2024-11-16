'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { name: 'Carbs', value: 50 },
  { name: 'Protein', value: 30 },
  { name: 'Fat', value: 20 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export function NutrientBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrient Breakdown</CardTitle>
        <CardDescription>Distribution of macronutrients in your diet</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}