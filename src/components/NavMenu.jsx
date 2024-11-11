'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function NavMenu() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <ul className="flex space-x-4">
      <li><Link href="/" className="hover:underline">Home</Link></li>
      {isAuthenticated ? (
        <>
          <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
          <li><Link href="/log-food" className="hover:underline">Log Food</Link></li>
          <li><Link href="/profile" className="hover:underline">Profile</Link></li>
          <li><Button onClick={() => signOut()} variant="ghost">Sign Out</Button></li>
        </>
      ) : (
        <>
          <li><Link href="/auth/signin" className="hover:underline">Sign In</Link></li>
          <li><Link href="/auth/register" className="hover:underline">Register</Link></li>
        </>
      )}
    </ul>
  )
}