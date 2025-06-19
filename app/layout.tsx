import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AccessibilityProvider } from '@/hooks/useAccessibility'
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Meet - Virtual Meeting Platform",
  description: "Professional virtual meeting platform",
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
           <AccessibilityProvider>
            <Toaster
              toastOptions={{
              classNames: {
                toast: "bg-purple-600 text-white shadow-lg",
                description: "text-white/80",
                actionButton: "bg-white text-purple-600 hover:bg-purple-200",
                cancelButton: "bg-white text-purple-600 hover:bg-purple-200",
              },
            }}
           />
            {children}
            </AccessibilityProvider>
            </body>
    </html>
  )
}
