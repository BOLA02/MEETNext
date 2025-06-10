'use client'

import SettingsHeader from '@/components/settings/SettingsHeader'
import { useState } from 'react'

export default function SecurityPrivacySettings() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold">Security & Privacy</h2>

        <div className="space-y-2">
          <label>Password</label>
          <input type="password" placeholder="********" className="border rounded px-3 py-2 w-full" />
        </div>

        <div className="space-y-2 mt-4">
          <label>2FA Authentication</label>
          <input type="checkbox" defaultChecked /> Enable two-factor authentication
        </div>
      </section>
    </div>
  )
}
