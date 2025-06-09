'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function GeneralSettings() {
  const [profile, setProfile] = useState({
    firstName: 'Kamaldeen',
    lastName: 'Abdulkareem',
    email: 'abdulkareemkama@gmail.com',
    bio: 'Product designer at Meta',
  })

  const [editing, setEditing] = useState<{ field: string | null }>({ field: null })
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('')
  const [locale, setLocale] = useState('')
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('23')
  const [search, setSearch] = useState('')

  const handleEdit = (field: string) => setEditing({ field })
  const handleSave = () => setEditing({ field: null })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Account / Settings</h1>
        <div className="relative w-72">
          <Input
          placeholder="Search anything here..."
          className="pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        </div>
      </div>

      {/* Profile Information */}
      <section className="bg-white rounded-lg p-6 shadow border space-y-4">
        <h2 className="font-semibold text-gray-700 mb-3">Profile information</h2>
        <div className="flex gap-4 items-center">
         <div className="w-16 h-16 relative">
  <Image
    src="/black.png"
    alt="Profile"
    fill
    className="rounded-full object-cover"
  />
</div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {Object.keys(profile).map((key) => {
  const label = key as keyof typeof profile
  const matchesSearch =
    search.trim() === '' ||
    profile[label].toLowerCase().includes(search.trim().toLowerCase())

  if (!matchesSearch) return null

  return (
    <div key={key} className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 capitalize">{key}</p>
        {editing.field === key ? (
          <Input
            value={profile[label]}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="w-full"
          />
        ) : (
          <p className="text-sm font-medium">{profile[label]}</p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() =>
          editing.field === key ? handleSave() : handleEdit(key)
        }
      >
        {editing.field === key ? 'Save' : 'Edit'}
      </Button>
    </div>
  )
})}

          </div>
        </div>
      </section>

      {/* Language & Region */}
      <section className="bg-white rounded-lg p-6 shadow border">
        <h2 className="font-semibold text-gray-700 mb-3">Language and region</h2>
        <div className="grid grid-cols-3 gap-4">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option>English</option>
            <option>French</option>
          </select>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option value="">Select timezone</option>
            <option value="WAT">WAT (West Africa Time)</option>
          </select>
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option value="">Select locale</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white rounded-lg p-6 shadow border">
        <h2 className="font-semibold text-gray-700 mb-3">Appearance</h2>
        <div className="grid grid-cols-3 gap-6">
          {['light', 'dark', 'system'].map((option) => (
            <div
              key={option}
              onClick={() => setTheme(option)}
              className={`border rounded h-24 cursor-pointer flex items-center justify-center ${
                theme === option ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              {option === 'light' ? 'Light Theme' : option === 'dark' ? 'Dark Theme' : 'System Default'}
            </div>
          ))}
        </div>
        <select
          className="mt-4 border rounded px-3 py-2 text-sm"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="23">23</option>
          <option value="18">18</option>
          <option value="16">16</option>
        </select>
      </section>
    </div>
  )
}
