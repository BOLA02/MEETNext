// components/Header.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, HelpCircle, MessageSquare, Settings, Home, Video, Calendar, FileText, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Video, label: 'Meetings', href: '/dashboard/meetings' },
  { icon: MessageSquare, label: 'Team Chat', href: '/dashboard/chats' },
  { icon: Calendar, label: 'Scheduler', href: '/dashboard/scheduler' },
  { icon: FileText, label: 'Docs', href: '/dashboard/docs' },
  { icon: MoreHorizontal, label: 'More', href: '/dashboard/more' },
]

const Header = () => {
  const [showUserProfile, setShowUserProfile] = useState(false)
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm w-full">
      {/* Logo and app name */}
      <div className="flex items-center gap-3">
        <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} className="rounded" />
        <span className="font-bold text-lg text-[#7c3aed] tracking-tight">MeetNext</span>
      </div>
      {/* Navigation icons */}
      <nav className="flex items-center gap-2 ml-8">
        {navItems.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-gray-100 transition text-gray-700 text-xs font-medium"
            title={label}
            onClick={() => router.push(href)}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            {label}
          </button>
        ))}
      </nav>
      {/* Search bar */}
      <div className="flex-1 flex items-center justify-center">
        <input
          type="text"
          placeholder="Search   Ctrl+F"
          className="w-72 px-4 py-2 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm shadow-sm"
        />
      </div>
      {/* Right icons and profile */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserProfile(!showUserProfile)}
            className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm"
          >
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
          </button>
          {showUserProfile && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserProfile(false)}
              />
              <div className="absolute right-0 top-10 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center rounded-full">
                    <span className="text-white font-bold">K</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Kamaldeen Abdulkareem</h4>
                    <p className="text-sm text-gray-500">abdulkareemkama@gmail.com</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                    View profile
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                    Account settings
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                    Billing
                  </button>
                  <hr className="my-2" />
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-red-600">
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
