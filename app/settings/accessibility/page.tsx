'use client'

import { useState, useEffect } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Switch } from '@/components/ui/switch'

export default function AccessibilitySettings() {
  const { highContrast, setHighContrast, screenReader, setScreenReader } = useAccessibility()
  const [search, setSearch] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // ❗ Prevent mismatched SSR

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border space-y-6">
        <h2 className="text-lg font-semibold">Accessibility Settings</h2>

        <div className="flex items-center justify-between">
          <span className="font-medium">Enable Screen Reader Support</span>
          <Switch checked={screenReader} onCheckedChange={setScreenReader} className="data-[state=checked]:bg-purple-600" />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Enable High Contrast Mode</span>
          <Switch checked={highContrast} onCheckedChange={setHighContrast} className="data-[state=checked]:bg-purple-600" />
        </div>
      </section>
    </div>
  )
}
