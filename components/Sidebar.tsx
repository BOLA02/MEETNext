// components/Sidebar.tsx
'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Video, FolderOpen, MessageSquare, AtSign, Users, Star, Hash, AppWindow, MoreHorizontal } from "lucide-react"
import clsx from "clsx"

const sidebarSections = [
  {
    header: 'Mentions',
    items: [
      { id: "mentions", icon: AtSign, label: "Mentions", href: "/dashboard/mentions" },
    ]
  },
  {
    header: 'DMs',
    items: [
      { id: "dms", icon: Users, label: "DMs and channels", href: "/dashboard/dms" },
      { id: "starred", icon: Star, label: "Starred", href: "/dashboard/starred" },
    ]
  },
  {
    header: 'Channels',
    items: [
      { id: "channels", icon: Hash, label: "Channels", href: "/dashboard/channels" },
    ]
  },
  {
    header: 'Meeting chats',
    items: [
      { id: "meetings", icon: Video, label: "Meeting chats", href: "/dashboard/meetings" },
    ]
  },
  {
    header: 'Apps',
    items: [
      { id: "apps", icon: AppWindow, label: "Apps", href: "/dashboard/apps" },
    ]
  },
  {
    header: 'More',
    items: [
      { id: "more", icon: MoreHorizontal, label: "More", href: "/dashboard/more" },
    ]
  },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#23272f] text-white flex flex-col min-h-screen border-r border-gray-900 shadow-lg">
      <div className="flex flex-col gap-2 py-6 px-3">
        {sidebarSections.map((section, idx) => (
          <div key={section.header} className="mb-2">
            <div className="text-xs font-semibold text-gray-400 px-2 mb-1 tracking-wide uppercase select-none">
              {section.header}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                      isActive ? "bg-[#313543] text-white shadow" : "text-gray-300 hover:bg-[#2d313a] hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            {idx < sidebarSections.length - 1 && <div className="my-2 border-b border-gray-800" />}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
