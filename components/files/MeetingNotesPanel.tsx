'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'

const mockNotes = [
  {
    id: 1,
    title: 'Meetio designers hangout April 2025',
    date: 'Tue April 23, 10:30 PM - 12:16 PM',
    avatar: '/avatar-1.png' // replace with a real avatar or placeholder
  },
  {
    id: 2,
    title: 'Meetio designers follow-up',
    date: 'Tue April 23, 10:30 PM - 12:16 PM',
    avatar: '/avatar-1.png'
  },
  {
    id: 3,
    title: 'Meetio monthly UX sync',
    date: 'Tue April 23, 10:30 PM - 12:16 PM',
    avatar: '/avatar-1.png'
  }
]

export default function MeetingNotesPanel() {
  const [meetingFilter, setMeetingFilter] = useState('All meetings')
  const [date, setDate] = useState<Date | undefined>()

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Meeting notes</h2>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Meeting filter dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setMeetingFilter(meetingFilter === 'All meetings' ? 'Meetings I hosted' : 'All meetings')
            }
            className="border px-4 py-2 text-sm rounded-md flex items-center gap-2"
          >
            {meetingFilter}
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* Replace this with a real dropdown if needed */}
        </div>

        {/* Date filter */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="border px-4 py-2 text-sm rounded-md flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {date ? format(date, 'PPP') : 'Date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Meeting Notes List */}
      <div className="space-y-4">
        {mockNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border rounded-lg px-4 py-3 flex items-start gap-3 hover:shadow-sm"
          >
            <img
              src={note.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{note.title}</h4>
              <p className="text-xs text-gray-500">{note.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
