'use client'

import { useEffect, useRef, useState } from "react"
import { MoreVertical, Copy, MessageSquare } from "lucide-react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Modal from "@/components/ui/Modal"
import { format } from 'date-fns'
import ScheduleMeetingModal from "@/components/meeting/ScheduleMeetingModal"

// Meeting type definition
interface Meeting {
  id: number
  title: string
  host: string
  date: string // ISO format (yyyy-MM-dd)
  startTime: string
  endTime: string
}

const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: "Hibut conference by Meetio 2025",
    host: "Kamaldeen Abdulkareem",
    date: "2025-03-20",
    startTime: "12:30 AM",
    endTime: "3:30 AM"
  },
  {
    id: 2,
    title: "JFK photography summit 2025",
    host: "Kamaldeen Abdulkareem",
    date: "2025-03-20",
    startTime: "12:30 AM",
    endTime: "3:30 AM"
  }
]

export default function MeetingSection() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) 
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)  // ✅ state for schedule modal

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(`Meeting: ${title}`)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDelete = () => {
    if (confirmDeleteId !== null) {
      setMeetings(prev => prev.filter(m => m.id !== confirmDeleteId))
      setConfirmDeleteId(null)
    }
  }

  const selectedDateOnly: Date = selectedDate ?? new Date()

  const filteredMeetings = meetings.filter(m =>
    m.date === format(selectedDateOnly, 'yyyy-MM-dd')
  )

  return (
    <>
      <div className="flex gap-6 relative">
        {/* Calendar */}
        <div className="w-[300px] bg-white rounded-xl shadow p-4">
  <Calendar
    onChange={setSelectedDate}
    value={selectedDate}
    calendarType="iso8601"
    showNavigation={false}
  />
</div>


        {/* Meeting List */}
        <div className="flex-1 space-y-6">
          <h4 className="text-lg font-semibold">
            {format(selectedDateOnly, 'EEEE, MMMM d, yyyy')}
          </h4>

          {filteredMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
              <img src="/no-meeting.png" alt="Empty calendar" className="w-40 h-40 object-contain" />
              <h2 className="text-lg font-semibold">No meeting available yet</h2>
              <p className="text-sm text-gray-500 ">Schedule a meeting for this date</p>

              {/* ✅ Hook up modal here */}
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-sm"
              >
                Schedule a meeting
              </button>
            </div>
          ) : (
            filteredMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between relative"
              >
                <div>
                  <div className="text-xs text-gray-400">{format(selectedDateOnly, 'EEE, MMM d')}</div>
                  <div className="text-sm font-semibold">
                    {meeting.startTime} - {meeting.endTime}
                  </div>
                  <h3 className="text-md font-bold">{meeting.title}</h3>
                  <p className="text-sm text-gray-500">Hosted by: {meeting.host}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleCopy(meeting.title)}>
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button>
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => setMenuOpenId(menuOpenId === meeting.id ? null : meeting.id)}>
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>

                  {menuOpenId === meeting.id && (
                    <div ref={menuRef} className="absolute right-4 top-16 w-48 bg-white shadow border rounded z-50">
                      <button
                        onClick={() => handleCopy(meeting.title)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Copy invitation
                      </button>
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
                        Edit meeting schedule
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(meeting.id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 text-sm"
                      >
                        Delete schedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={copySuccess} title="Copied" onClose={() => setCopySuccess(false)} showCloseIcon={false}>
        <p className="text-sm text-gray-600">Meeting invitation copied to clipboard.</p>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={confirmDeleteId !== null} title="Delete meeting?" onClose={() => setConfirmDeleteId(null)}>
        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this meeting?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-sm border rounded">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded">
            Delete
          </button>
        </div>
      </Modal>

      {/* ✅ Your ScheduleMeetingModal */}
      {isScheduleModalOpen && (
        <ScheduleMeetingModal onClose={() => setIsScheduleModalOpen(false)} />
      )}
    </>
  )
}
