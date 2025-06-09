'use client'

import { useState } from 'react'

export default function StepThree() {
  const [repeat, setRepeat] = useState('Weekly')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Technology')
  const [format, setFormat] = useState('Hybrid event')
  const [tags, setTags] = useState(['Technology', 'Business', 'SAAS', 'Tech'])

  return (
    <div className="space-y-6">
      {/* Repeat Option */}
      <div>
        <label className="block text-sm font-medium mb-1">Repeat</label>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
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

      {/* Category and Tags */}
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
            <option>Marketing</option>
            <option>Health</option>
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
