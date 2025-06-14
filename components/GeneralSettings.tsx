'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Camera } from 'lucide-react'

export default function GeneralSettings() {
  const [profile, setProfile] = useState({
    firstName: 'Kamaldeen',
    lastName: 'Abdulkareem',
    email: 'abdulkareemkama@gmail.com',
    bio: 'Product designer at Meta',
  })

  const [avatar, setAvatar] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ field: string | null }>({ field: null })
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('')
  const [locale, setLocale] = useState('')
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('23')
  const [search, setSearch] = useState('')

  const handleEdit = (field: string) => setEditing({ field })
  const handleSave = () => setEditing({ field: null })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Utility function to check if search term matches any string value
  const matchesSearch = (value: string) => {
    return search.trim() === '' || value.toLowerCase().includes(search.trim().toLowerCase())
  }

  return (
    <div className="space-y-6">
      <SettingsHeader search={search} setSearch={setSearch} />

      {/* Profile Information */}
      {Object.keys(profile).some((key) => matchesSearch(profile[key as keyof typeof profile])) && (
        <section className="bg-white rounded-lg p-6 shadow border space-y-4">
          <h2 className="font-semibold text-gray-700 mb-3">Profile information</h2>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 relative group">
              <Image
                src={avatar || "/black.png"}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-full">
                <label className="cursor-pointer">
                  <Camera className="text-white w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {Object.keys(profile).map((key) => {
                const label = key as keyof typeof profile
                if (!matchesSearch(profile[label])) return null

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
      )}

      {/* Language & Region */}
      {(matchesSearch(language) || matchesSearch(timezone) || matchesSearch(locale)) && (
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
      )}

      {/* Appearance */}
      {(matchesSearch(theme) || matchesSearch(fontSize)) && (
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
      )}
    </div>
  )
}
