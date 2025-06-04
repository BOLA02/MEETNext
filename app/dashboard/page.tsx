"use client"

import { useState } from "react"
import {
  Home,
  Video,
  FolderOpen,
  MessageSquare,
  Calendar,
  HelpCircle,
  Settings,
  Plus,
  MoreHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  Hash,
  Users,
  Phone,
  Play,
  Smile,
  Paperclip,
  Send,
  FileText,
  Download,
  Upload,
  Clock,
  Star,
  Eye,
  Share,
  Bell,
  Shield,
  Mic,
  Keyboard,
  Accessibility,
  Zap,
  MicOff,
  VideoOff,
  Monitor,
  MoreVertical,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home")
  const [activeChatTab, setActiveChatTab] = useState("all")
  const [activeFileTab, setActiveFileTab] = useState("my-files")
  const [activeMeetingStep, setActiveMeetingStep] = useState("details")
  const [activeSettingsTab, setActiveSettingsTab] = useState("general")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showChatRoom, setShowChatRoom] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showPlusDropdown, setShowPlusDropdown] = useState(false)

  // Form state for meeting creation
  const [meetingTitle, setMeetingTitle] = useState("Meet Easter Get-Together event, April 2025")
  const [meetingDescription, setMeetingDescription] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6")
  const [secondaryColor, setSecondaryColor] = useState("#1F2937")
  const [accentColor, setAccentColor] = useState("#3B82F6")
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessage, setChatMessage] = useState("")

  const router = useRouter()

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const handleStartInstantMeeting = () => {
    // Pass dynamic meeting title and host
    const params = new URLSearchParams({
      title: "Instant Meeting",
      host: "Kamaldeen Abdulkareem",
    })
    router.push(`/meeting/live?${params.toString()}`)
  }

  const handleStartMeetingFromDropdown = () => {
    const params = new URLSearchParams({
      title: "Quick Meeting",
      host: "Kamaldeen Abdulkareem",
    })
    router.push(`/meeting/live?${params.toString()}`)
    setShowPlusDropdown(false)
  }

  const handleSettingsClick = () => {
    setActiveSection("settings")
  }

  const handleScheduleMeeting = () => {
    setShowScheduleModal(true)
    setShowPlusDropdown(false)
  }

  const handleJoinChatRoom = () => {
    setShowChatRoom(true)
  }

  const scheduledMeetings = [
    {
      id: 1,
      title: "Hibut conference by Meet 2025",
      host: "Kamaldeen Abdulkareem",
      date: "Fri, March 20",
      time: "12:30AM - 3:30 AM",
    },
    {
      id: 2,
      title: "JFK photography summit 2025",
      host: "Kamaldeen Abdulkareem",
      date: "Fri, March 20",
      time: "12:30AM - 3:30 AM",
    },
  ]

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "meetings", icon: Video, label: "Meetings" },
    { id: "files", icon: FolderOpen, label: "Files" },
    { id: "chats", icon: MessageSquare, label: "Chats" },
  ]

  const chatTabs = [
    { id: "all", label: "All chats(7)", icon: MessageSquare },
    { id: "tags", label: "Tags(2)", icon: Hash },
    { id: "dms", label: "DMs(4)", icon: Users },
    { id: "meeting-chats", label: "Meeting chats", icon: Video },
    { id: "rooms", label: "Rooms", icon: Home },
  ]

  const fileTabs = [
    { id: "my-files", label: "My Files" },
    { id: "recent", label: "Recent" },
    { id: "meeting-notes", label: "Meeting notes" },
    { id: "shared", label: "Shared" },
  ]

  const settingsTabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "events", label: "Events", icon: Calendar },
    { id: "ai-features", label: "AI features", icon: Zap },
    { id: "notification", label: "Notification", icon: Bell },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "recording", label: "Recording", icon: Video },
    { id: "integration", label: "Integration", icon: Share },
    { id: "keyboard", label: "Keyboard shortcuts", icon: Keyboard },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
  ]

  // ... (keeping all the existing render functions the same)
  const renderChatRoom = () => {
    return (
      <div className="flex h-full bg-gray-900 text-white">
        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">War room connect 2025</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowChatRoom(false)}>
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
            <p className="text-sm text-gray-400">7 members • General discussion</p>
          </div>

          {/* Participants */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Participants (7)</h4>
            <div className="space-y-2">
              {[
                { name: "Andrew Tate", status: "speaking", avatar: "A", color: "bg-orange-500" },
                { name: "Sam Patel", status: "muted", avatar: "S", color: "bg-blue-500" },
                { name: "Kamal", status: "online", avatar: "K", color: "bg-purple-500" },
                { name: "Felix Opoku", status: "online", avatar: "F", color: "bg-green-500" },
                { name: "Pelvin", status: "away", avatar: "P", color: "bg-yellow-500" },
                { name: "Tommy Shelby", status: "online", avatar: "T", color: "bg-gray-600" },
                { name: "Togas", status: "online", avatar: "T", color: "bg-red-500" },
              ].map((participant, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${participant.color}`}
                    >
                      {participant.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        participant.status === "speaking"
                          ? "bg-green-400"
                          : participant.status === "online"
                            ? "bg-green-400"
                            : participant.status === "muted"
                              ? "bg-red-400"
                              : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{participant.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{participant.status}</p>
                  </div>
                  {participant.status === "speaking" && (
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-green-400 rounded-full animate-pulse"
                          style={{ height: Math.random() * 12 + 4 }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Room Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">War room connect 2025 | Room 1</h2>
                <p className="text-sm text-gray-400">7 participants • Started 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4 bg-gray-900">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Main Speaker */}
              <div className="col-span-2 bg-gray-800 rounded-lg overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">A</span>
                    </div>
                    <p className="text-white font-medium">Andrew Tate</p>
                    <p className="text-orange-200 text-sm">Speaking...</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">Andrew Tate</div>
                  <div className="bg-green-500 p-1 rounded">
                    <Mic className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Other Participants */}
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg overflow-hidden relative h-32">
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">S</span>
                      </div>
                      <p className="text-white text-sm">Sam Patel</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-red-500 p-1 rounded">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden relative h-32">
                  <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">K</span>
                      </div>
                      <p className="text-white text-sm">Kamal</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-green-500 p-1 rounded">
                    <Mic className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden relative h-32">
                  <div className="w-full h-full bg-green-500 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">F</span>
                      </div>
                      <p className="text-white text-sm">Felix</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-red-500 p-1 rounded">
                    <VideoOff className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <Monitor className="h-5 w-5" />
              </Button>
              <Button variant="destructive" size="icon" className="rounded-full">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ... (keeping all other render functions the same - renderSettingsContent, renderChatContent, renderFileContent, renderMeetingStep)

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case "general":
        return (
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-6">Profile Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">K</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="Kamaldeen" readOnly className="flex-1" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="Abdulkareem" readOnly className="flex-1" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input defaultValue="abdulkareemkama@gmail.com" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="Abdulkareem" readOnly className="flex-1" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="Product designer at Meta" readOnly className="flex-1" />
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Language and Region */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-6">Language and region</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="English">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="Select timezone">
                    <option>Select timezone</option>
                    <option>UTC</option>
                    <option>EST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locale</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="Select locale">
                    <option>Select locale</option>
                    <option>US</option>
                    <option>UK</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-6">Appearance</h3>
              <div className="space-y-6">
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-full h-20 bg-gray-100 rounded-lg border-2 border-gray-200 mb-2"></div>
                      <p className="text-sm font-medium">Light Theme</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-gray-900 rounded-lg border-2 border-gray-200 mb-2"></div>
                      <p className="text-sm font-medium">Dark Theme</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-gradient-to-r from-gray-100 to-gray-900 rounded-lg border-2 border-purple-500 mb-2"></div>
                      <p className="text-sm font-medium">System default</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font size</label>
                  <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="22">
                    <option>18</option>
                    <option>20</option>
                    <option>22</option>
                    <option>24</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">
              {settingsTabs.find((tab) => tab.id === activeSettingsTab)?.label}
            </h3>
            <p className="text-gray-600">Settings content for {activeSettingsTab} will be implemented here.</p>
          </div>
        )
    }
  }

  const renderChatContent = () => {
    switch (activeChatTab) {
      case "meeting-chats":
        return (
          <div className="flex h-full">
            {/* Chat Sidebar */}
            <div className="w-1/3 border-r bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Meeting chats</h3>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative mb-4">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search or start a new chat"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: "Kamal",
                      message: "Thank you for sharing the documents...",
                      time: "12:30 PM",
                      avatar: "K",
                      online: true,
                    },
                    {
                      name: "E-learning",
                      message: "Delivered/sent: @- Jami Lake note...",
                      time: "12:30 PM",
                      avatar: "E",
                      online: true,
                    },
                    {
                      name: "War room connect 2024",
                      message: "Received: @- The outreach was a total su...",
                      time: "1:30 PM",
                      avatar: "W",
                      online: false,
                      active: true,
                    },
                  ].map((chat, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${chat.active ? "bg-purple-50 border-l-4 border-purple-500" : ""}`}
                      onClick={chat.active ? handleJoinChatRoom : undefined}
                    >
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            chat.avatar === "K" ? "bg-purple-500" : chat.avatar === "E" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        >
                          {chat.avatar}
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Meeting Room Preview */}
            <div className="flex-1 flex flex-col">
              <div className="border-b p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
                      W
                    </div>
                    <div>
                      <h3 className="font-medium">War room connect 2025 | Room 1</h3>
                      <p className="text-sm text-gray-500">7 members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button size="sm" className="bg-purple-500 text-white" onClick={handleJoinChatRoom}>
                      Join Room
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <div className="text-white text-6xl">👥</div>
                </div>
              </div>

              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">General</h4>
                    <p className="text-sm text-gray-600">1000+ participants</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Rooms
                    </Button>
                    <Button variant="outline" size="sm">
                      Announcements
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Yesterday</span>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Sam patel</span>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      That's true, but you guys have to see how the system is, the others don't want regular people to
                      win.
                    </p>
                    <p className="text-sm text-gray-700 mt-1">When is the next booking day? I'm curious 🤔</p>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Today</span>
                </div>

                <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">When is the next booking day? I'm curious 🤔</p>
                </div>

                <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">August 23rd of this year are scheduled games service</p>
                </div>
              </div>

              <div className="border-t p-4 bg-white">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      className="pr-12"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex h-full">
            <div className="w-1/3 border-r bg-white p-4">
              <h3 className="font-medium mb-4">All chats</h3>
              <p className="text-gray-500 text-sm">Select a chat tab to view content</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )
    }
  }

  const renderFileContent = () => {
    switch (activeFileTab) {
      case "my-files":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Files</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm" className="bg-purple-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create new file
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FolderOpen className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Add a document</span>
                </div>
                <p className="text-sm text-gray-600">Upload or create new documents</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Video className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Add a recording</span>
                </div>
                <p className="text-sm text-gray-600">Upload meeting recordings</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Meeting notes for April 2025</h4>
                    <p className="text-sm text-gray-500">Last modified: 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium">Hibut conference recording</h4>
                    <p className="text-sm text-gray-500">Last modified: 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">JFK summit presentation</h4>
                    <p className="text-sm text-gray-500">Last modified: 3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "recent":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Files</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <Clock className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <h4 className="font-medium">Create new file</h4>
                  <p className="text-sm text-gray-500">Start a new document</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <Star className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <h4 className="font-medium">Share from meeting notes</h4>
                  <p className="text-sm text-gray-500">Accessed 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <h4 className="font-medium">Meeting file</h4>
                  <p className="text-sm text-gray-500">Accessed 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "meeting-notes":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Meeting Notes</h2>
              <Button size="sm" className="bg-purple-500 text-white">
                Create new note
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Meeting docs</h3>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Meeting agenda April 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span>Action items checklist</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Hibut designers hangout April 2025</h3>
                  <p className="text-sm text-gray-600 mb-2">Hosted by: Kamaldeen Abdulkareem</p>
                  <p className="text-sm text-gray-500">April 16, 2025 • 7:00 PM</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Calendar</h3>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                  <div className="p-1">S</div>
                  <div className="p-1">M</div>
                  <div className="p-1">T</div>
                  <div className="p-1">W</div>
                  <div className="p-1">T</div>
                  <div className="p-1">F</div>
                  <div className="p-1">S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i + 1}
                      className={`p-1 hover:bg-gray-100 rounded cursor-pointer ${i + 1 === 16 ? "bg-purple-500 text-white" : ""}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Files</h2>
            <p className="text-gray-500">Select a file category to view content</p>
          </div>
        )
    }
  }

  const renderMeetingStep = () => {
    switch (activeMeetingStep) {
      case "ticketing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Ticket type</h3>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="ticketType" className="rounded-full" />
                  <span className="text-sm">Free</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ticketType" className="rounded-full" defaultChecked />
                  <span className="text-sm">Paid</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ticketType" className="rounded-full" />
                  <span className="text-sm">Donation based</span>
                </label>
              </div>

              <h4 className="font-medium mb-3">Ticket Formats</h4>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="ticketFormat" className="rounded-full" />
                  <span className="text-sm">Physical</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ticketFormat" className="rounded-full" defaultChecked />
                  <span className="text-sm">E-ticket</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Ticket pricing and currency</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="United states">
                    <option>United states</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="U. S. Dollar (USD)">
                    <option>U. S. Dollar (USD)</option>
                    <option>Euro (EUR)</option>
                    <option>British Pound (GBP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price</label>
                  <Input defaultValue="$100.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VIP Price</label>
                  <Input defaultValue="$170.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VVIP Price</label>
                  <Input defaultValue="$220.00" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Ticket quantity</h4>
                <Input defaultValue="100,000" />
              </div>
              <div>
                <h4 className="font-medium mb-3">Discount and Promo code</h4>
                <label className="flex items-center gap-2">
                  <input type="radio" name="discount" className="rounded-full" defaultChecked />
                  <span className="text-sm">Create discount codes for attendees.</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Choose payment method</h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" className="rounded-full" />
                    <span className="text-sm">Stripe payment</span>
                  </div>
                  <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs">stripe</div>
                </label>

                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" className="rounded-full" />
                    <span className="text-sm">Paypal</span>
                  </div>
                  <div className="text-blue-600 font-bold text-sm">PayPal</div>
                </label>

                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" className="rounded-full" defaultChecked />
                    <span className="text-sm">Credit card</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                      VISA
                    </div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                      MC
                    </div>
                  </div>
                </label>

                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name on card</label>
                      <Input placeholder="Enter name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Card number</label>
                      <Input placeholder="Enter card number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiration date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Card code</label>
                      <div className="flex gap-2">
                        <Input placeholder="CVC" className="flex-1" />
                        <button className="text-blue-500 text-sm">What's this?</button>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Save card for future use</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case "branding":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Event Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your event logo</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload cover image (1920x1080 recommended)</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded border"></div>
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-800 rounded border"></div>
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded border"></div>
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Email Templates</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Registration Confirmation</span>
                    <Button variant="outline" size="sm">
                      Customize
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Event Reminder</span>
                    <Button variant="outline" size="sm">
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                placeholder="Meetio Easter Get-Together event, April 2025"
                className="w-full"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="flex gap-2 items-center mb-2">
                <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="4/15/2025">
                  <option>4/15/2025</option>
                  <option>4/16/2025</option>
                  <option>4/17/2025</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="7:00 PM">
                  <option>7:00 PM</option>
                  <option>8:00 PM</option>
                  <option>9:00 PM</option>
                </select>
                <span className="text-gray-500">to</span>
                <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="12:00 PM">
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="4/15/2025">
                  <option>4/15/2025</option>
                  <option>4/16/2025</option>
                  <option>4/17/2025</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="West Central Africa">
                  <option>West Central Africa</option>
                  <option>Eastern Time</option>
                  <option>Pacific Time</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
              <select className="border rounded-lg px-3 py-2 text-sm" defaultValue="Weekly">
                <option>Weekly</option>
                <option>Daily</option>
                <option>Monthly</option>
                <option>Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none"
                placeholder="Add meeting description..."
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="Technology">
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Technology</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Business</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">SAAS</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Tech</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="Hybrid event">
                <option>Hybrid event</option>
                <option>Virtual only</option>
                <option>In-person only</option>
              </select>
            </div>
          </div>
        )
    }
  }

  const renderContent = () => {
    if (showChatRoom) {
      return renderChatRoom()
    }

    switch (activeSection) {
      case "settings":
        return (
          <div className="flex h-full">
            {/* Settings Sidebar */}
            <div className="w-64 bg-white border-r">
              <div className="p-6">
                <h2 className="text-xl font-bold text-purple-500 mb-6">Settings</h2>
                <nav className="space-y-2">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSettingsTab === tab.id ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Account/Settings</h1>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search anything here..." className="pl-10 w-64" />
                </div>
              </div>
              {renderSettingsContent()}
            </div>
          </div>
        )

      case "meetings":
        return (
          <div className="flex h-full">
            {/* Calendar Section */}
            <div className={`${showScheduleModal ? "w-1/2" : "w-full"} ${showScheduleModal ? "border-r" : ""}`}>
              <div className="bg-purple-600 text-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        className="bg-white text-purple-600 hover:bg-gray-100"
                        onClick={() => setShowPlusDropdown(!showPlusDropdown)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Today
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>

                      {showPlusDropdown && (
                        <div className="absolute top-10 left-0 w-48 bg-white border rounded-lg shadow-lg z-50">
                          <button
                            onClick={handleScheduleMeeting}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 border-b"
                          >
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Schedule meeting
                          </button>
                          <button
                            onClick={handleStartMeetingFromDropdown}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700"
                          >
                            <Video className="h-4 w-4 inline mr-2" />
                            Start a meeting
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-purple-700 rounded">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="font-medium text-lg">March 2025</span>
                      <button className="p-1 hover:bg-purple-700 rounded">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                    <input
                      type="text"
                      placeholder="Search for a meeting..."
                      className="bg-purple-700 text-white placeholder-white pl-10 pr-4 py-2 rounded-lg text-sm w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white-300"
                    >
                      <Filter className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Calendar Grid */}
                <div className="w-1/2 bg-white p-4">
                  <h3 className="font-medium text-gray-800 mb-4">March 2025</h3>
                  <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                    <div className="text-center p-2">MON</div>
                    <div className="text-center p-2">TUE</div>
                    <div className="text-center p-2">WED</div>
                    <div className="text-center p-2">THU</div>
                    <div className="text-center p-2">FRI</div>
                    <div className="text-center p-2">SAT</div>
                    <div className="text-center p-2">SUN</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`text-center p-2 text-sm hover:bg-gray-100 rounded cursor-pointer ${
                          i + 1 === 1 ? "bg-purple-600 text-white rounded-full" : ""
                        } ${i + 1 === 20 ? "bg-purple-100 text-purple-600 font-medium" : ""}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="w-1/2 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">Today</h3>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">No event scheduled</p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Fri, March 20</h4>

                    {[
                      {
                        title: "Hibut conference by Meetio 2025",
                        host: "Kamaldeen Abdulkareem",
                        time: "12:30AM\n3:30 AM",
                      },
                      { title: "JFK photography summit 2025", host: "Kamaldeen Abdulkareem", time: "12:30AM\n3:30 AM" },
                      { title: "JFK photography summit 2025", host: "Kamaldeen Abdulkareem", time: "12:30AM\n3:30 AM" },
                      { title: "JFK photography summit 2025", host: "Kamaldeen Abdulkareem", time: "12:30AM\n3:30 AM" },
                    ].map((meeting, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="text-center text-sm">
                              <div className="font-medium">{meeting.time.split("\n")[0]}</div>
                              <div className="text-gray-500">{meeting.time.split("\n")[1]}</div>
                            </div>
                            <div className="w-1 h-12 bg-purple-500 rounded"></div>
                            <div>
                              <h5 className="font-medium text-gray-800">{meeting.title}</h5>
                              <p className="text-sm text-gray-500">Hosted by: {meeting.host}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Creation Modal */}
            {showScheduleModal && (
              <div className="w-1/2 p-6 bg-gray-50">
                <div className="bg-white rounded-lg border p-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Schedule meeting</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowScheduleModal(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex border-b mb-6">
                    <button
                      onClick={() => setActiveMeetingStep("details")}
                      className={`px-4 py-2 text-sm border-b-2 ${
                        activeMeetingStep === "details"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-600"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveMeetingStep("ticketing")}
                      className={`px-4 py-2 text-sm border-b-2 ${
                        activeMeetingStep === "ticketing"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-600"
                      }`}
                    >
                      Ticketing and pricing
                    </button>
                    <button
                      onClick={() => setActiveMeetingStep("branding")}
                      className={`px-4 py-2 text-sm border-b-2 ${
                        activeMeetingStep === "branding"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-600"
                      }`}
                    >
                      Branding and customization
                    </button>
                  </div>

                  {renderMeetingStep()}

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline">Back</Button>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        {activeMeetingStep === "branding" ? "Create Meeting" : "Next"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "chats":
        return (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-purple-500 text-white p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 text-sm">
                  {chatTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChatTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded ${
                        activeChatTab === tab.id ? "bg-purple-600" : "hover:bg-purple-600"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <Button size="sm" className="bg-white text-purple-500 hover:bg-gray-100">
                  New chat
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1">{renderChatContent()}</div>
          </div>
        )

      case "files":
        return (
          <div className="flex flex-col h-full">
            {/* File Header */}
            <div className="bg-purple-500 text-white p-4">
              <div className="flex gap-4 text-sm">
                {fileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFileTab(tab.id)}
                    className={`px-3 py-1 rounded ${
                      activeFileTab === tab.id ? "bg-purple-600" : "hover:bg-purple-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Content */}
            <div className="flex-1 bg-white">{renderFileContent()}</div>
          </div>
        )

      default:
        return (
          <div className="p-8">
           <div className="mb-8 flex justify-center">
        <img
          src="/people.png"
          alt="People working together"
          className="w-80 h-48 object-cover rounded-lg"
        />
      </div>


            {/* Action Buttons */}
            <div className="max-w-md mx-auto space-y-4 mb-8">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-full flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                Join a Meeting
              </Button>

              <Button
                onClick={handleStartInstantMeeting}
                className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full flex items-center justify-center gap-2"
              >
                <Video className="h-5 w-5" />
                Start an instant meeting
              </Button>

              <Button
                onClick={handleScheduleMeeting}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-full flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Schedule a meeting
              </Button>
            </div>

            {/* Scheduled Meetings */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
              <div className="space-y-4">
                {scheduledMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{meeting.date}</div>
                        <div className="text-xs text-gray-500">{meeting.time}</div>
                      </div>
                      <div>
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-gray-500">Hosted by: {meeting.host}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-25 bg-white border-r flex flex-col items-center py-10 px-3">
    <div className="mt-12 space-y-6 w-full">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={`w-full flex flex-col items-center p-3 rounded-lg transition-colors ${
            activeSection === item.id
              ? "bg-purple-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <item.icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b">
          <h1 className="text-2xl font-bold text-purple-600">Meetio</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Sun, Jan 19 • 10:21 PM</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600" onClick={handleSettingsClick}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
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
                  <div className="absolute right-0 top-10 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                          <span className="text-white font-bold">K</span>
                        </div>
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
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Billing</button>
                      <hr className="my-2" />
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-red-600">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">{renderContent()}</main>
      </div>

      {/* Click outside to close dropdowns */}
      {(showPlusDropdown || showUserProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowPlusDropdown(false)
            setShowUserProfile(false)
          }}
        />
      )}
    </div>
  )
}
