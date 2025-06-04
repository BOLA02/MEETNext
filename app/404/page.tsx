"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, Video, FolderOpen, MessageSquare } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "meetings", icon: Video, label: "Meetings" },
    { id: "files", icon: FolderOpen, label: "Files" },
    { id: "chats", icon: MessageSquare, label: "Chats" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r flex flex-col items-center py-6 space-y-6">
        {sidebarItems.map((item) => (
          <button key={item.id} className="flex flex-col items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100">
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b">
          <h1 className="text-2xl font-bold text-teal-600">Meetio</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Sun, Jan 19 • 10:21 PM</span>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">K</span>
              </div>
            </div>
          </div>
        </header>

        {/* 404 Content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-8xl font-bold text-teal-600 mb-4 flex items-center justify-center gap-4">
                4
                <div className="w-16 h-16 border-4 border-teal-600 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-teal-600 rounded"></div>
                </div>
                4
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Page not found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              The page you're looking for either removed or
              <br />
              temporarily unavailable, you can also{" "}
              <button className="text-teal-600 hover:underline">contact support</button>
              <br />
              for help.
            </p>

            <Button onClick={() => router.push("/dashboard")} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
              Refresh
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-gray-500 border-t bg-white">
          © 2025 Meetio Meetings. All rights reserved.{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Privacy Policy
          </a>{" "}
          &{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Terms of Service
          </a>
        </footer>
      </div>
    </div>
  )
}
