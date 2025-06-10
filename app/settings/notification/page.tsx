'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import SettingsHeader from '@/components/settings/SettingsHeader'

type NotificationItem = {
  id: string
  label: string
  checked: boolean
}

type NotificationSection = {
  title: string
  items: NotificationItem[]
}

const initialSections: NotificationSection[] = [
  {
    title: 'Team chat',
    items: [
      { id: 'direct-messages', label: 'Direct messages', checked: true },
      { id: 'mentions', label: 'Mentions (@me or @all)', checked: true },
      { id: 'replies', label: 'Replies to threads I follow', checked: true },
      { id: 'channel-updates', label: 'Channel updates', checked: false },
    ],
  },
  {
    title: 'Meetings',
    items: [
      { id: 'recording-ready', label: 'Meeting recording ready', checked: true },
      { id: 'transcript-ready', label: 'Meeting transcript ready', checked: false },
      { id: 'missed-calls', label: 'Missed video calls', checked: true },
    ],
  },
  {
    title: 'Whiteboard',
    items: [
      { id: 'whiteboard-added', label: 'Added to a whiteboard', checked: true },
      { id: 'whiteboard-mentions', label: 'Mentions @me', checked: false },
    ],
  },
  {
    title: 'Notes',
    items: [
      { id: 'shared-with-me', label: 'Shared with me', checked: true },
    ],
  },
]

export default function NotificationSettingsPage() {
  const [sections, setSections] = useState(initialSections)
  const [search, setSearch] = useState('')

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    setSections((prev) =>
      prev.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, iIdx) =>
                iIdx === itemIndex ? { ...item, checked: !item.checked } : item
              ),
            }
          : section
      )
    )
  }

  const handleReset = () => setSections(initialSections)
  const handleSave = () => {
    // save logic here
    console.log('Saved settings:', sections)
  }

  return (
    <div className="p-6 w-full">
    <SettingsHeader search={search} setSearch={setSearch} />

      <Card className="p-6 space-y-4 border rounded-lg w-full">
        <h2 className="text-sm font-semibold border-b pb-2">Manage activity center notifications</h2>
        <p className="text-xs text-muted-foreground">
          Send notifications to activity center for the following:
        </p>

        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, iIdx) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => handleToggle(sIdx, iIdx)}
                    />
                    <Label htmlFor={item.id} className="text-sm">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave} className='bg-purple-600'>Save</Button>
        </div>
      </Card>
    </div>
  )
}
