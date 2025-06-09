'use client'

import { useState } from 'react'
import {
  FileText,
  Clock,
  FileSignature,
  Share2,
  Star,
  Search
} from 'lucide-react'

const tabs = [
  { label: 'My Files', icon: FileText },
  { label: 'Recent', icon: Clock },
  { label: 'Meeting notes', icon: FileSignature },
  { label: 'Shared files', icon: Share2 },
  { label: 'Favorites', icon: Star }
]

interface FileTopbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function FileTopbar({ activeTab, onTabChange }: FileTopbarProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      {/* Tabs */}
      <div className="flex items-center gap-6">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onTabChange(label)}
            className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition ${
              activeTab === label
                ? 'border-purp;e-700 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search for a file..."
          className="pl-9 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  )
}
