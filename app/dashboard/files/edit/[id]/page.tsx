'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import EditorLayout from '@/components/files/EditorLayout'

export default function EditFilePage() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const storageKey = `draft-${id}`

  // Load saved draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const { title, body } = JSON.parse(saved)
      setTitle(title)
      setBody(body)
    }
  }, [storageKey])

  // Debounced autosave
  useEffect(() => {
    if (!title && !body) return

    setIsSaving(true)
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify({ title, body }))
      setIsSaving(false)
      setSaveMessage('Saved')

      setTimeout(() => setSaveMessage(''), 2000)
    }, 1200)

    return () => clearTimeout(timeout)
  }, [title, body, storageKey])

  return (
    <EditorLayout>
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-3xl font-semibold text-gray-800 w-full outline-none bg-transparent"
        />
        {isSaving ? (
          <span className="text-sm text-gray-500 animate-pulse">Saving...</span>
        ) : (
          saveMessage && <span className="text-sm text-green-500">{saveMessage}</span>
        )}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Edit your note..."
        className="w-full mt-4 h-[400px] text-gray-700 resize-none outline-none bg-transparent"
      />
    </EditorLayout>
  )
}
