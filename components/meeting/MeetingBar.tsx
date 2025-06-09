'use client'

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import ScheduleMeetingModal from "@/components/meeting/ScheduleMeetingModal"
import { Button } from "@/components/ui/button"

export default function MeetingBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="flex items-center justify-between w-full gap-4 relative">
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          {/* Plus Button with Dropdown */}
          <Button
            className="bg-purple-700 hover:bg-purple-800 text-white rounded-full px-4 flex items-center gap-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Plus className="w-4 h-4" /> Today
          </Button>

          {dropdownOpen && (
            <div className="absolute left-0 top-12 bg-white shadow border rounded-lg z-50 w-56">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => {
                  setDropdownOpen(false)
                  setShowModal(true)
                }}
              >
                Schedule a meeting
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Start a meeting
              </button>
            </div>
          )}

          <ChevronLeft className="w-5 h-5 text-gray-600" />
          <ChevronRight className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">March 2025</h2>
        </div>

        {/* Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for a meeting..."
            className="pl-9 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {showModal && <ScheduleMeetingModal onClose={() => setShowModal(false)} />}
    </>
  )
}
