// components/Sidebar.tsx
'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Video, FolderOpen, MessageSquare } from "lucide-react"
import clsx from "clsx"

const sidebarItems = [
  { id: "home", icon: Home, label: "Home", href: "/dashboard" },
  { id: "meetings", icon: Video, label: "Meetings", href: "/dashboard/meetings" },
  { id: "files", icon: FolderOpen, label: "Files", href: "/dashboard/files" },
  { id: "chats", icon: MessageSquare, label: "Chats", href: "/dashboard/chats" },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="w-24 bg-white border-r flex flex-col items-center py-10 px-3 min-h-screen">
      <div className="space-y-6 w-full">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                "w-full flex flex-col items-center p-3 rounded-lg transition-colors",
                isActive ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
