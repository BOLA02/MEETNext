'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Camera, Edit, Eye, EyeOff, Save } from 'lucide-react'

const LS_KEY = 'general_settings_v1'

const LANGUAGES = ['English', 'French', 'Spanish', 'German']
const TIMEZONES = ['UTC', 'WAT (West Africa Time)', 'EST', 'PST']
const LOCALES = ['en-US', 'fr-FR', 'es-ES', 'de-DE']
const THEMES = ['light', 'dark', 'system']
const FONT_SIZES = ['16', '18', '23']
const COLORS = ['#7C3AED', '#2563EB', '#059669', '#F59E42', '#EF4444']

export default function GeneralSettings() {
  const [settings, setSettings] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [editing, setEditing] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(parsed)
      setAvatar(parsed.avatar || null)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(LS_KEY, JSON.stringify({ ...settings, avatar }))
  }, [settings, avatar, loaded])

  const handleEdit = (field) => setEditing(field)
  const handleSave = () => setEditing('')
  const handleChange = (key, value) => setSettings((s) => ({ ...s, [key]: value }))

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Helper for search
  const match = (text) => search.trim() === '' || text.toLowerCase().includes(search.trim().toLowerCase())

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 50 50">
        <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
        <circle className="opacity-80" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="100" strokeDashoffset="60" />
      </svg>
    </div>
  )

  return (
    <div className="space-y-8">
      <SettingsHeader search={search} setSearch={setSearch} />

      {/* Profile Card */}
      {(match('profile') || match(settings.firstName || '') || match(settings.lastName || '')) && (
        <section className="bg-white rounded-lg p-6 shadow border flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative w-28 h-28 group">
            <Image
              src={avatar || '/black.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-purple-200"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-full">
              <label className="cursor-pointer">
                <Camera className="text-white w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-xs text-gray-500">First name</p>
                {editing === 'firstName' ? (
                  <Input
                    value={settings.firstName || ''}
                    onChange={e => handleChange('firstName', e.target.value)}
                    className="w-40"
                  />
                ) : (
                  <p className="text-lg font-semibold">{settings.firstName || 'First name'}</p>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={() => editing === 'firstName' ? handleSave() : handleEdit('firstName')}>
                {editing === 'firstName' ? <Save /> : <Edit />}
              </Button>
              <div>
                <p className="text-xs text-gray-500">Last name</p>
                {editing === 'lastName' ? (
                  <Input
                    value={settings.lastName || ''}
                    onChange={e => handleChange('lastName', e.target.value)}
                    className="w-40"
                  />
                ) : (
                  <p className="text-lg font-semibold">{settings.lastName || 'Last name'}</p>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={() => editing === 'lastName' ? handleSave() : handleEdit('lastName')}>
                {editing === 'lastName' ? <Save /> : <Edit />}
              </Button>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bio</p>
              {editing === 'bio' ? (
                <Input
                  value={settings.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-gray-700">{settings.bio || 'Add a short bio'}</p>
              )}
              <Button size="icon" variant="ghost" onClick={() => editing === 'bio' ? handleSave() : handleEdit('bio')}>
                {editing === 'bio' ? <Save /> : <Edit />}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Account Info */}
      {(match('email') || match('phone') || match('password')) && (
        <section className="bg-white rounded-lg p-6 shadow border space-y-4">
          <h2 className="font-semibold text-gray-700 mb-3">Account information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              {editing === 'email' ? (
                <Input
                  value={settings.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm font-medium">{settings.email || 'Add email'}</p>
              )}
              <Button size="icon" variant="ghost" onClick={() => editing === 'email' ? handleSave() : handleEdit('email')}>
                {editing === 'email' ? <Save /> : <Edit />}
              </Button>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              {editing === 'phone' ? (
                <Input
                  value={settings.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm font-medium">{settings.phone || 'Add phone'}</p>
              )}
              <Button size="icon" variant="ghost" onClick={() => editing === 'phone' ? handleSave() : handleEdit('phone')}>
                {editing === 'phone' ? <Save /> : <Edit />}
              </Button>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Password</p>
              {editing === 'password' ? (
                <div className="flex gap-2 items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.password || ''}
                    onChange={e => handleChange('password', e.target.value)}
                    className="w-60"
                  />
                  <Button size="icon" variant="ghost" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              ) : (
                <p className="text-sm font-medium">••••••••</p>
              )}
              <Button size="icon" variant="ghost" onClick={() => editing === 'password' ? handleSave() : handleEdit('password')}>
                {editing === 'password' ? <Save /> : <Edit />}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Language & Region */}
      {(match('language') || match('region') || match('timezone') || match('locale')) && (
        <section className="bg-white rounded-lg p-6 shadow border">
          <h2 className="font-semibold text-gray-700 mb-3">Language and region</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Language</p>
              <select value={settings.language || LANGUAGES[0]} onChange={e => handleChange('language', e.target.value)} className="border rounded px-3 py-2 text-sm w-full">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Timezone</p>
              <select value={settings.timezone || ''} onChange={e => handleChange('timezone', e.target.value)} className="border rounded px-3 py-2 text-sm w-full">
                <option value="">Select timezone</option>
                {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Locale</p>
              <select value={settings.locale || ''} onChange={e => handleChange('locale', e.target.value)} className="border rounded px-3 py-2 text-sm w-full">
                <option value="">Select locale</option>
                {LOCALES.map(lc => <option key={lc}>{lc}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Region</p>
              <Input value={settings.region || ''} onChange={e => handleChange('region', e.target.value)} className="w-full" placeholder="Enter region" />
            </div>
          </div>
        </section>
      )}

      {/* Appearance */}
      {(match('appearance') || match('theme') || match('font') || match('color')) && (
        <section className="bg-white rounded-lg p-6 shadow border">
          <h2 className="font-semibold text-gray-700 mb-3">Appearance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Theme</p>
              <div className="flex gap-2">
                {THEMES.map(option => (
                  <div
                    key={option}
                    onClick={() => handleChange('theme', option)}
                    className={`border rounded h-16 w-20 cursor-pointer flex items-center justify-center ${settings.theme === option ? 'ring-2 ring-purple-600' : ''}`}
                  >
                    {option === 'light' ? 'Light' : option === 'dark' ? 'Dark' : 'System'}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Font size</p>
              <select
                className="border rounded px-3 py-2 text-sm w-full"
                value={settings.fontSize || FONT_SIZES[0]}
                onChange={e => handleChange('fontSize', e.target.value)}
              >
                {FONT_SIZES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Accent color</p>
              <div className="flex gap-2 items-center">
                {COLORS.map(color => (
                  <button
                    key={color}
                    style={{ background: color }}
                    className={`w-8 h-8 rounded-full border-2 ${settings.color === color ? 'border-purple-600' : 'border-white'}`}
                    onClick={() => handleChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
