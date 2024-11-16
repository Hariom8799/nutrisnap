'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuthStatus()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-foreground text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        
        <h1 className="text-4xl font-bold mb-6">Welcome to NutriSnap</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Track your nutrition, set goals, and achieve a healthier lifestyle with our easy-to-use platform.
        </p>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">Dashboard</Button>
              </Link>
              <Link href="/log-food">
                <Button size="lg">Log Food</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button size="lg" variant="secondary">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <FeatureCard
          icon="🍎"
          title="Track Nutrition"
          description="Log your meals and track your daily nutritional intake with ease."
        />
        <FeatureCard
          icon="🏋️‍♀️"
          title="Set Goals"
          description="Set personalized health and fitness goals tailored to your needs."
        />
        <FeatureCard
          icon="📊"
          title="Analyze Progress"
          description="Visualize your progress with detailed charts and insights."
        />
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white text-primary p-6 rounded-lg shadow-lg"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}