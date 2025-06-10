'use client'

import { useState } from 'react'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Checkbox } from '@/components/ui/checkbox'

export default function RecordingSettings() {
  const [search, setSearch] = useState('')

  const searchFilter = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase())

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border space-y-6">
        <h2 className="text-lg font-semibold">Recording & Replay Settings</h2>

        {searchFilter('automatic recording') && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Automatic Recording:</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-record" />
              <label htmlFor="auto-record" className="text-sm text-gray-600">
                Record events by default
              </label>
            </div>
          </div>
        )}

        {searchFilter('access control for recordings') && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Access Control for Recordings:</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="limit-access" />
              <label htmlFor="limit-access" className="text-sm text-gray-600">
                Limit access to hosts and co-hosts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email-verification" />
              <label htmlFor="email-verification" className="text-sm text-gray-600">
                Require email verification to view
              </label>
            </div>
          </div>
        )}

        {searchFilter('ai-generated highlights') && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">AI-Generated Highlights & Clips:</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="ai-highlights" />
              <label htmlFor="ai-highlights" className="text-sm text-gray-600">
                Enable AI to summarize recordings
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="clip-extraction" />
              <label htmlFor="clip-extraction" className="text-sm text-gray-600">
                Automatically extract highlight clips
              </label>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
