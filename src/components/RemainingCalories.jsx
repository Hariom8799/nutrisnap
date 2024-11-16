import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function RemainingCalories({ caloriesConsumed, calorieGoal }) {
  const remainingCalories = calorieGoal - caloriesConsumed
  const percentageConsumed = (caloriesConsumed / calorieGoal) * 100

  const getSuggestion = () => {
    if (remainingCalories > 500) {
      return "You have plenty of calories left. Consider having a nutritious meal."
    } else if (remainingCalories > 200) {
      return "You have some calories left. A light snack might be a good idea."
    } else if (remainingCalories > 0) {
      return "You're close to your calorie goal. Choose your next meal carefully."
    } else {
      return "You've reached your calorie goal for the day. Try to avoid eating more if possible."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {remainingCalories > 0 ? remainingCalories : 0} kcal
        </div>
        <Progress value={percentageConsumed} className="w-full" />
        <p className="mt-4 text-sm text-muted-foreground">{getSuggestion()}</p>
      </CardContent>
    </Card>
  )
}