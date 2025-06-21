'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Settings,
  Calendar,
  Sparkles,
  Bell,
  Lock,
  Video,
  Shield,
  Keyboard,
  Accessibility
} from 'lucide-react'

const items = [
  { label: 'General', icon: Settings },
  { label: 'Events', icon: Calendar },
  { label: 'AI features', icon: Sparkles },
  { label: 'Notification', icon: Bell },
  { label: 'Security & Privacy', icon: Lock },
  { label: 'Recording', icon: Video },
  { label: 'Integration', icon: Shield },
  { label: 'Keyboard shortcuts', icon: Keyboard },
  { label: 'Accessibility', icon: Accessibility }
]

export default function SettingsSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-purple-600">Meet</h1>
      {items.map(({ label, icon: Icon }) => {
        const href = `/settings/${label.toLowerCase().replace(/ /g, '-')}`
        const isActive = pathname === href

        return (
          <button
            key={label}
            onClick={() => router.push(href)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            
               <Icon className="w-4 h-4 " />
            {label}
          </button>
        )
      })}
    </div>
  )
}
