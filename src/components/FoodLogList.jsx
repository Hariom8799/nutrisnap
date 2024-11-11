import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function FoodLogList({ foodLogs }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Food</TableHead>
          <TableHead>Calories</TableHead>
          <TableHead>Protein</TableHead>
          <TableHead>Carbs</TableHead>
          <TableHead>Fat</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodLogs.map((log) => (
          <TableRow key={log._id}>
            <TableCell>{log.foodName}</TableCell>
            <TableCell>{log.nutritionInfo.calories}</TableCell>
            <TableCell>{log.nutritionInfo.protein}g</TableCell>
            <TableCell>{log.nutritionInfo.carbs}g</TableCell>
            <TableCell>{log.nutritionInfo.fat}g</TableCell>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}