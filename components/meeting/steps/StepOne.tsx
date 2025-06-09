'use client'

import { useState } from 'react'
import { CalendarDays, Globe, X } from 'lucide-react'

export default function StepOne() {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('2025-04-15')
  const [startTime, setStartTime] = useState('07:00PM')
  const [endDate, setEndDate] = useState('2025-04-15')
  const [endTime, setEndTime] = useState('12:00PM')
  const [repeat, setRepeat] = useState('Weekly')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Technology')
  const [format, setFormat] = useState('Hybrid event')
  const [tags, setTags] = useState(['Technology', 'Business', 'SAAS', 'Tech'])

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
      </div>

      {/* Date + Time */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded px-3 py-2 w-24" />
        </div>
        <span className="mt-6">to</span>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded px-3 py-2 w-24" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">West Central Africa</span>
        </div>
      </div>

      {/* Repeat */}
      <div>
        <label className="block text-sm font-medium mb-1">Repeat</label>
        <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className="border rounded px-3 py-2">
          <option>Weekly</option>
          <option>Daily</option>
          <option>Monthly</option>
          <option>Never</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded px-4 py-2"
        />
      </div>

      {/* Category + Tags */}
      <div className="flex gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Technology</option>
            <option>Business</option>
            <option>Education</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full border text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium mb-1">Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option>Hybrid event</option>
          <option>In-person</option>
          <option>Virtual</option>
        </select>
      </div>
    </div>
  )
}
