// components/Topbar.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, HelpCircle, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"


const Header = () => {
  const [showUserProfile, setShowUserProfile] = useState(false)
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-xl font-bold text-purple-600">Meet</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">Sun, Jan 19 • 10:21 PM</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
            <Settings className="h-5 w-5 text-gray-600" />
            </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserProfile(!showUserProfile)}
              className="w-8 h-8 rounded-full overflow-hidden"
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
      </div>
    </header>
  )
}

export default Header
