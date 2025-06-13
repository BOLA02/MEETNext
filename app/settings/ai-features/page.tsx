'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Sparkles, Search } from 'lucide-react'

const features = [
  {
    category: 'Smart Scheduling Suggestions',
    items: [
      {
        id: 'recommend-time',
        label: 'AI recommends the best time based on attendee availability',
        checked: true,
      },
      {
        id: 'auto-adjust-timezone',
        label: 'Auto-adjust time zones for global audiences',
        checked: true,
      },
    ],
  },
  {
    category: 'Auto-Generated Event Descriptions',
    items: [
      {
        id: 'ai-descriptions',
        label: 'AI drafts descriptions based on event details',
        checked: true,
      },
    ],
  },
  {
    category: 'Live AI Summaries & Transcripts',
    items: [
      {
        id: 'realtime-captions',
        label: 'Real-time captions and post-event transcription options',
        checked: true,
      },
    ],
  },
  {
    category: 'Engagement Analytics',
    items: [
      {
        id: 'ai-analytics',
        label: 'AI analyzes attendee participation and provides engagement scores',
        checked: true,
      },
    ],
  },
]

export default function AIFeaturesSettings() {
  const [search, setSearch] = useState('')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    features.forEach(category => {
      category.items.forEach(item => {
        initial[item.id] = item.checked
      })
    })
    return initial
  })

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }))
  }

  const filteredFeatures = features.filter(({ category, items }) => {
    const query = search.toLowerCase()
    return (
      category.toLowerCase().includes(query) ||
      items.some((item) => item.label.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Account / Settings</h1>

        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything here..."
            className="pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>
      </div>

      {/* AI Features Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-medium text-gray-900">AI-Powered Enhancements</h2>
        </div>

        <Card className="border border-gray-200 bg-white shadow">
          <CardContent className="p-6 space-y-8">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((section) => (
                <div key={section.category} className="space-y-4">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {section.category}:
                  </h3>
                  <div className="space-y-3 ml-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <Checkbox
                          id={item.id}
                          checked={checkedItems[item.id]}
                          onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
                          className="mt-0.5 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">
                No features matched your search.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}