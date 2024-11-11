import { NextResponse } from 'next/server'
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log('Middleware executed for path:', req.nextUrl.pathname)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Auth check for token:', token ? 'exists' : 'does not exist')
        return !!token
      }
    },
  }
)

export const config = { matcher: ["/dashboard", "/profile", "/log-food"] }