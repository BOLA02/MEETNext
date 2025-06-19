import "./globals.css"
import { Inter } from "next/font/google"
import { AccessibilityProvider } from '@/hooks/useAccessibility'
import { Toaster } from "sonner"
import AppearanceProvider from '@/components/AppearanceProvider'

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
        <AppearanceProvider>
          <AccessibilityProvider>{children}</AccessibilityProvider>
          <Toaster />
        </AppearanceProvider>
      </body>
    </html>
  )
}
