// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { NavMenu } from '@/components/NavMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HealthifyMe Clone',
  description: 'Track your nutrition and calories with ease',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="bg-primary text-primary-foreground p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">HealthifyMe Clone</Link>
              <NavMenu />
            </nav>
          </header>
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
          <footer className="bg-muted mt-8 p-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 HealthifyMe Clone. All rights reserved.</p>
            </div>
          </footer>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}