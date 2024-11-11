import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'



export function DailyProgressWidget({ caloriesConsumed, calorieGoal, nutrients }) {
  const caloriePercentage = Math.min((caloriesConsumed / calorieGoal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Calories</span>
              <span className="text-sm font-medium">{caloriesConsumed} / {calorieGoal}</span>
            </div>
            <Progress value={caloriePercentage} />
          </div>
          {nutrients.map((nutrient) => {
            const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
            return (
              <div key={nutrient.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{nutrient.name}</span>
                  <span className="text-sm font-medium">{nutrient.current}g / {nutrient.goal}g</span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}