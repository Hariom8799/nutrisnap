'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalorieChart } from '@/components/CalorieChart'
import { NutrientBreakdown } from '@/components/NutrientBreakdown'
import { FoodLogList } from '@/components/FoodLogList'
import { DailyProgressWidget } from '@/components/DailyProgressWidget'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null)
  const [foodLogs, setFoodLogs] = useState([])
  const [userProfile, setUserProfile] = useState({
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 100,
    dailyCarbsGoal: 250,
    dailyFatGoal: 70,
  })
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
  }, [isAuthenticated, userId ])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUserId(data.userId)
        console.log(data)
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
      if (!response.ok) throw new Error('Failed to fetch user profile')
      const data = await response.json()
      
      if (data.dailyCalorieGoal && data.dailyProteinGoal && data.dailyCarbsGoal && data.dailyFatGoal) {
        setUserProfile(data)
      } else {
        console.warn("Fetched data is incomplete, using default userProfile values")
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

  const dailyTotals = calculateDailyTotals()

  const nutrients = [
    { name: 'Protein', current: dailyTotals.protein, goal: userProfile.dailyProteinGoal },
    { name: 'Carbs', current: dailyTotals.carbs, goal: userProfile.dailyCarbsGoal },
    { name: 'Fat', current: dailyTotals.fat, goal: userProfile.dailyFatGoal },
  ]

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
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
            nutrients={nutrients}
          />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Nutrient Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <NutrientBreakdown foodLogs={foodLogs} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
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










// 'use client'

// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { CalorieChart } from '@/components/CalorieChart'
// import { NutrientBreakdown } from '@/components/NutrientBreakdown'
// import { FoodLogList } from '@/components/FoodLogList'
// import { DailyProgressWidget } from '@/components/DailyProgressWidget'
// import { useToast } from  '@/hooks/use-toast'
// import { motion } from 'framer-motion'

// export default function Dashboard() {

//   const foodLogs = [
//     {
//       _id: '1',
//       foodName: 'Chicken Breast',
//       nutritionInfo: {
//         calories: 165,
//         protein: 31,
//         carbs: 0,
//         fat: 3.6,
//       },
//       timestamp: new Date('2024-11-10T08:00:00Z').toISOString(),
//     },
//     {
//       _id: '2',
//       foodName: 'Banana',
//       nutritionInfo: {
//         calories: 89,
//         protein: 1.1,
//         carbs: 23,
//         fat: 0.3,
//       },
//       timestamp: new Date('2024-11-11T12:30:00Z').toISOString(),
//     },
//     {
//       _id: '3',
//       foodName: 'Salmon',
//       nutritionInfo: {
//         calories: 208,
//         protein: 20,
//         carbs: 0,
//         fat: 13,
//       },
//       timestamp: new Date('2024-11-11T18:45:00Z').toISOString(),
//     },
//   ];

  
//   const { data: session } = useSession()
//   // const [foodLogs, setFoodLogs] = useState([])
//   // const [userProfile, setUserProfile] = useState(null)
//   const { showToast } = useToast()
//   const [userProfile, setUserProfile] = useState({
//     dailyCalorieGoal: 2000,
//     dailyProteinGoal: 100,
//     dailyCarbsGoal: 250,
//     dailyFatGoal: 70,
//   })

//   // useEffect(() => {
//   //   if (session?.user?.id) {
//   //     fetchFoodLogs()
//   //     fetchUserProfile()
//   //   }
//   // }, [session])

//   const fetchFoodLogs = async () => {
//     try {
//       const response = await fetch(`/api/food-logs?userId=${session.user.id}`)
//       if (!response.ok) throw new Error('Failed to fetch food logs')
//       const data = await response.json()
//       setFoodLogs(data)
//     } catch (error) {
//       console.error('Error fetching food logs:', error)
//       showToast({ title: 'Error', description: 'Failed to fetch food logs', variant: 'destructive' })
//     }
//   }

//   // const fetchUserProfile = async () => {
//   //   try {
//   //     const response = await fetch(`/api/user-profile?userId=${session.user.id}`)
//   //     if (!response.ok) throw new Error('Failed to fetch user profile')
//   //     const data = await response.json()
//   //     setUserProfile(data)
//   //   } catch (error) {
//   //     console.error('Error fetching user profile:', error)
//   //     showToast({ title: 'Error', description: 'Failed to fetch user profile', variant: 'destructive' })
//   //   }
//   // }

//   const calculateDailyTotals = () => {
//     const today = new Date().toDateString()
//     const todayLogs = foodLogs.filter(log => new Date(log.timestamp).toDateString() === today)
//     return todayLogs.reduce((totals, log) => {
//       totals.calories += log.nutritionInfo.calories
//       totals.protein += log.nutritionInfo.protein
//       totals.carbs += log.nutritionInfo.carbs
//       totals.fat += log.nutritionInfo.fat
//       return totals
//     }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
//   }

//   const dailyTotals = calculateDailyTotals()

//   if (!session) {
//     return <div>Please sign in to view your dashboard.</div>
//   }

  

//   const nutrients = [
//     { name: 'Protein', current: 80, goal: userProfile.dailyProteinGoal },
//     { name: 'Carbs', current: 150, goal: userProfile.dailyCarbsGoal },
//     { name: 'Fat', current: 40, goal: userProfile.dailyFatGoal },
//   ]

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-6"
//     >
//       <h1 className="text-3xl font-bold">Your Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <DailyProgressWidget
//             caloriesConsumed={dailyTotals.calories}
//             calorieGoal={userProfile?.dailyCalorieGoal || 2000}
//             proteinConsumed={dailyTotals.protein}
//             proteinGoal={userProfile?.dailyProteinGoal || 50}
//             carbsConsumed={dailyTotals.carbs}
//             carbsGoal={userProfile?.dailyCarbsGoal || 250}
//             fatConsumed={dailyTotals.fat}
//             fatGoal={userProfile?.dailyFatGoal || 70}
//           />
//         </motion.div>
//         <motion.div
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>Calorie Intake</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CalorieChart foodLogs={foodLogs} />
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Nutrient Breakdown</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <NutrientBreakdown foodLogs={foodLogs} />
//           </CardContent>
//         </Card>
//       </motion.div>
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Food Logs</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <FoodLogList foodLogs={foodLogs} />
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   )
// }







// 'use client'

// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { CalorieChart } from '@/components/CalorieChart'
// import { NutrientBreakdown } from '@/components/NutrientBreakdown'
// import { FoodLogList } from '@/components/FoodLogList'

// export default function Dashboard() {

//   const foodLogs = [
//     {
//       _id: '1',
//       foodName: 'Chicken Breast',
//       nutritionInfo: {
//         calories: 165,
//         protein: 31,
//         carbs: 0,
//         fat: 3.6,
//       },
//       timestamp: new Date('2024-11-10T08:00:00Z').toISOString(),
//     },
//     {
//       _id: '2',
//       foodName: 'Banana',
//       nutritionInfo: {
//         calories: 89,
//         protein: 1.1,
//         carbs: 23,
//         fat: 0.3,
//       },
//       timestamp: new Date('2024-11-11T12:30:00Z').toISOString(),
//     },
//     {
//       _id: '3',
//       foodName: 'Salmon',
//       nutritionInfo: {
//         calories: 208,
//         protein: 20,
//         carbs: 0,
//         fat: 13,
//       },
//       timestamp: new Date('2024-11-11T18:45:00Z').toISOString(),
//     },
//   ];

//   const { data: session } = useSession()
//   // const [foodLogs, setFoodLogs] = useState([])

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchFoodLogs()
//     }
//   }, [session])

//   const fetchFoodLogs = async () => {
//     try {
//       const response = await fetch(`/api/food-logs?userId=${session.user.id}`)
//       if (!response.ok) throw new Error('Failed to fetch food logs')
//       const data = await response.json()
//       setFoodLogs(data)
//     } catch (error) {
//       console.error('Error fetching food logs:', error)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Your Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Calorie Intake</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CalorieChart foodLogs={foodLogs} />
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Nutrient Breakdown</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <NutrientBreakdown foodLogs={foodLogs} />
//           </CardContent>
//         </Card>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Food Logs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <FoodLogList foodLogs={foodLogs} />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }