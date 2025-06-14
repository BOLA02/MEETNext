'use client'

import { useState } from 'react'
import SettingsHeader from '@/components/settings/SettingsHeader'

export default function SecurityPrivacySettings() {
  const [search, setSearch] = useState('')

  const securityData = [
    {
      section: 'Smart Scheduling Suggestions',
      items: [
        { label: 'AI recommends the best time based on attendee availability', checked: true },
        { label: 'Auto-adjust time zones for global audiences', checked: true },
      ],
    },
    {
      section: 'Auto-Generated Event Descriptions',
      items: [],
    },
  ]

  const filteredData = securityData
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(section =>
      section.section.toLowerCase().includes(search.toLowerCase()) ||
      section.items.length > 0
    )

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Security & Privacy</h2>

        {filteredData.map((section, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold border-b pb-1 mb-3">{section.section}:</h3>

            <div className="space-y-3">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      item.checked ? 'border-purple-500' : 'border-gray-400'
                    }`}>
                    {item.checked && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
              {section.items.length === 0 && (
                <p className="text-gray-500 text-sm">No options listed</p>
              )}
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <p className="text-gray-400 text-sm">No results found.</p>
        )}
      </section>
    </div>
  )
}
