'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type AccessibilityContextType = {
  highContrast: boolean
  setHighContrast: (value: boolean) => void
  screenReader: boolean
  setScreenReader: (value: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  // Apply high contrast mode to <body> using a class
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  return (
    <AccessibilityContext.Provider
      value={{ highContrast, setHighContrast, screenReader, setScreenReader }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
