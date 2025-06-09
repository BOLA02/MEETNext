'use client'

import { MoreVertical, Copy, MessageSquare } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Modal from "@/components/ui/Modal"

interface Meeting {
  id: number
  title: string
  host: string
  date: string
  startTime: string
  endTime: string
}

const initialMeetings: Meeting[] = [
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

export default function MeetingSection() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // Close dropdown on outside click
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

  return (
    <>
      <div className="flex gap-6 relative">
        {/* Calendar */}
        <div className="w-[300px] bg-white border rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-4">March 2025</h3>
          <div className="grid grid-cols-7 text-center gap-2 text-sm text-gray-700">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="font-semibold">{day}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`p-2 rounded-full hover:bg-gray-100 ${i === 0 ? 'bg-purple-500 text-white' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Meeting List or Empty State */}
        <div className="flex-1 space-y-6">
          <h4 className="text-lg font-semibold">Today</h4>

          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
              <img
                src="/no-meeting.png"
                alt="Empty calendar"
                className="w-40 h-40 object-contain"
              />
              <h2 className="text-lg font-semibold">No meeting available yet</h2>
              <p className="text-sm text-gray-500">Schedule a meeting for this date</p>
              <button
                onClick={() => alert("TODO: Open modal or link")} // Replace with setShowModal when ready
                className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-sm"
              >
                Schedule a meeting
              </button>
            </div>
          ) : (
            meetings.map(meeting => (
              <div
                key={meeting.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between relative"
              >
                <div>
                  <div className="text-xs text-gray-400">{meeting.date}</div>
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
                    <div
                      ref={menuRef}
                      className="absolute right-4 top-16 w-48 bg-white shadow border rounded z-50"
                    >
                      <button
                        onClick={() => handleCopy(meeting.title)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Copy invitation
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
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
      <Modal
        isOpen={copySuccess}
        title="Copied"
        onClose={() => setCopySuccess(false)}
        showCloseIcon={false}
      >
        <p className="text-sm text-gray-600">Meeting invitation copied to clipboard.</p>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={confirmDeleteId !== null}
        title="Delete meeting?"
        onClose={() => setConfirmDeleteId(null)}
      >
        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this meeting?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  )
}
