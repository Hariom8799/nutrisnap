'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function NavMenu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Signed out successfully',
        })
        setIsAuthenticated(false)
        router.push('/')
      } else {
        throw new Error('Failed to sign out')
      }
    } catch (error) {
      console.error('Sign-out error:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      })
    }
  }

  return (
    <ul className="flex space-x-4 items-center">
      <li><Link href="/" className="hover:underline">Home</Link></li>
      {isAuthenticated ? (
        <>
          <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
          <li><Link href="/log-food" className="hover:underline">Log Food</Link></li>
          <li><Link href="/profile" className="hover:underline">Profile</Link></li>
          <li><Button onClick={handleSignOut} variant="ghost">Sign Out</Button></li>
        </>
      ) : (
        <>
          <li><Link href="/auth/signin" className="hover:underline">Sign In</Link></li>
          <li><Link href="/auth/signup" className="hover:underline">Sign Up</Link></li>
        </>
      )}
    </ul>
  )
}