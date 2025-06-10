'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SettingsHeaderProps {
  search: string
  setSearch: (value: string) => void
}

export default function SettingsHeader({ search, setSearch }: SettingsHeaderProps) {
  return (
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
  )
}
