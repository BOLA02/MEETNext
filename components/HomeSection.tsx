// components/HomeSection.tsx
'use client'

import { useState, useMemo, useCallback, memo } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LazyImage, usePerformanceMonitor } from '@/components/PerformanceOptimizer'

const meetings = [
  {
    id: 1,
    title: "Hibut conference by Meetio 2025",
    host: "Kamaldeen Abdulkareem",
    date: "Fri, March 20",
    startTime: "12:30 AM",
    endTime: "3:30 AM"
  },
  {
    id: 2,
    title: "JFK photography summit 2025",
    host: "Kamaldeen Abdulkareem",
    date: "Fri, March 20",
    startTime: "12:30 AM",
    endTime: "3:30 AM"
  }
]

// Memoized meeting item component
const MeetingItem = memo(({ 
  meeting, 
  isMenuOpen, 
  onToggleMenu 
}: {
  meeting: any
  isMenuOpen: boolean
  onToggleMenu: () => void
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border relative">
    <div className="text-sm text-gray-500">
      {meeting.date} <span className="ml-2">{meeting.startTime} - {meeting.endTime}</span>
    </div>
    <h3 className="text-md font-semibold">{meeting.title}</h3>
    <p className="text-sm text-gray-600">
      Hosted by: {meeting.host}
    </p>

    {/* Menu */}
    <div className="absolute right-4 top-4">
      <button onClick={onToggleMenu}>
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Copy invitation</button>
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Edit meeting schedule</button>
          <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 text-sm">Delete schedule</button>
        </div>
      )}
    </div>
  </div>
))

// Memoized action button component
const ActionButton = memo(({ 
  children, 
  onClick 
}: {
  children: React.ReactNode
  onClick?: () => void
}) => (
  <Button 
    className="w-[550px] bg-purple-700 hover:bg-purple-800 rounded-full"
    onClick={onClick}
  >
    {children}
  </Button>
))

export default function HomeSection() {
  const { renderCount } = usePerformanceMonitor('HomeSection')
  
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

  // Memoized handlers
  const handleToggleMenu = useCallback((meetingId: number) => {
    setMenuOpenId(meetingId === menuOpenId ? null : meetingId)
  }, [menuOpenId])

  // Memoized action handlers
  const handleJoinMeeting = useCallback(() => {
    // Join meeting logic
    console.log('Join meeting clicked')
  }, [])

  const handleStartInstantMeeting = useCallback(() => {
    // Start instant meeting logic
    console.log('Start instant meeting clicked')
  }, [])

  const handleScheduleMeeting = useCallback(() => {
    // Schedule meeting logic
    console.log('Schedule meeting clicked')
  }, [])

  // Memoized meeting items
  const meetingItems = useMemo(() => 
    meetings.map((meeting) => (
      <MeetingItem
        key={meeting.id}
        meeting={meeting}
        isMenuOpen={menuOpenId === meeting.id}
        onToggleMenu={() => handleToggleMenu(meeting.id)}
      />
    )), 
    [menuOpenId, handleToggleMenu]
  )

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Illustration */}
      <div className="flex justify-center">
        <LazyImage
          src="/people.png" 
          alt="Dashboard illustration"
          className="w-64 h-40 object-contain"
          placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 160'%3E%3Crect width='256' height='160' fill='%23f3f4f6'/%3E%3C/svg%3E"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <ActionButton onClick={handleJoinMeeting}>
          Join a Meeting
        </ActionButton>
        <ActionButton onClick={handleStartInstantMeeting}>
          Start an instant meeting
        </ActionButton>
        <ActionButton onClick={handleScheduleMeeting}>
          Schedule a meeting
        </ActionButton>
      </div>

      {/* Meeting List */}
      <div className="space-y-4">
        {meetingItems}
      </div>
    </div>
  )
}
