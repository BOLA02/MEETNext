// components/HomeSection.tsx
'use client'

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export default function HomeSection() {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Illustration */}
      <div className="flex justify-center">
        <img
          src="/people.png" 
          alt="Dashboard illustration"
          className="w-64 h-40 object-contain"
        />
      </div>

      {/* Action Buttons */}
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button className="w-[550px] bg-purple-700 hover:bg-purple-800 rounded-full">
            Join a Meeting
        </Button>
        <Button className="w-[550px] bg-purple-700 hover:bg-purple-800 rounded-full">
            Start an instant meeting
        </Button>
        <Button className="w-[550px] bg-purple-700 hover:bg-purple-800 rounded-full">
            Schedule a meeting
        </Button>
      </div>

      {/* Meeting List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white p-4 rounded-lg shadow-sm border relative"
          >
            <div className="text-sm text-gray-500">
              {meeting.date} <span className="ml-2">{meeting.startTime} - {meeting.endTime}</span>
            </div>
            <h3 className="text-md font-semibold">{meeting.title}</h3>
            <p className="text-sm text-gray-600">
              Hosted by: {meeting.host}
            </p>

            {/* Menu */}
            <div className="absolute right-4 top-4">
              <button onClick={() => setMenuOpenId(meeting.id === menuOpenId ? null : meeting.id)}>
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              {menuOpenId === meeting.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Copy invitation</button>
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Edit meeting schedule</button>
                  <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 text-sm">Delete schedule</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
