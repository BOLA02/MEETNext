'use client'

import { useState } from 'react'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Switch } from '@/components/ui/switch'

type ShortcutItem = {
  id: string
  description: string
  keys: string
  enabled: boolean
}

const initialShortcuts: ShortcutItem[] = [
  { id: 'control', description: 'Charge focus to meeting controls on top when sharing screen', keys: 'Ctrl + Alt + Shift', enabled: false },
  { id: 'previous page', description: 'View the previous page of video participants in gallery view', keys: 'Page Up', enabled: false },
  { id: 'Switch', description: 'Switch to speaker view', keys: 'Alt + F1', enabled: false },
  { id: 'gallery view', description: 'Switch to gallery view', keys: 'Ctrl + Alt + Shift', enabled: false },
   { id: 'loud recording', description: 'Start/stop cloud recording', keys: 'Alt + C', enabled: true },
  { id: 'Start/stop', description: 'Start/stop video', keys: 'Alt + V', enabled: true },
  { id: 'Mute/unmute', description: 'Mute/unmute my audio', keys: 'Alt + A', enabled: true },
  { id: 'Mute/unmute my audio', description: 'Mute/unmute my audio for everyone except host (host only)', keys: 'Ctrl + S', enabled: false },
  { id: 'Switch camera', description: 'Switch camera', keys: 'Alt + N', enabled: false },
  { id: 'Enter/exit', description: 'Enter/exit full screen mode', keys: 'Alt + F', enabled: true },
]

export default function KeyboardShortcutsSettings() {
  const [search, setSearch] = useState('')
  const [shortcuts, setShortcuts] = useState(initialShortcuts)

  const handleToggle = (id: string) => {
    setShortcuts((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    )
  }

  const filtered = shortcuts.filter(
    (s) =>
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.keys.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold border-b">Keyboard Shortcuts</h2>

        <div className="grid grid-cols-3 font-medium text-gray-600  pb-2">
          <span>Description</span>
          <span>Shortcut</span>
          <span className="text-right">Enable Global Shortcut</span>
        </div>

        <ul className="divide-y">
          {filtered.map((s) => (
            <li key={s.id} className="grid grid-cols-3 items-center py-3">
              <span>{s.description}</span>
              <code className=" px-2 py-1 rounded text-sm">{s.keys}</code>
              <div className="text-right">
                <Switch
                  checked={s.enabled}
                  onCheckedChange={() => handleToggle(s.id)}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="col-span-3 text-gray-400 pt-4">
              No shortcuts match your search.
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
