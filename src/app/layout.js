import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { NavMenu } from '@/components/NavMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NutriSnap',
  description: 'Track your nutrition and calories with ease',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-primary-foreground p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">NutriSnap</Link>
            <NavMenu />
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer className="bg-muted p-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 NutriSnap. All rights reserved.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}