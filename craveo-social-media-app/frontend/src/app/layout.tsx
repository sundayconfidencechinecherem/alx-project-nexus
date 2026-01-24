import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Craveo - Food Social Media',
  description: 'Discover, share, and connect over food. Your food-focused social network.',
  keywords: ['food', 'social media', 'recipes', 'culinary', 'foodies'],
  authors: [{ name: 'Craveo Team' }],
  creator: 'Craveo',
  publisher: 'Craveo',
  themeColor: '#1B9F20',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
