'use client'

import { useEffect, useState } from 'react'
import EditorLayout from '@/components/files/EditorLayout'
import { useSearchParams } from 'next/navigation'

export default function CreateFilePage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const searchParams = useSearchParams()
  const insertType = searchParams.get('insert')


  useEffect(() => {
  if (insertType === 'table') {
    setBody((prev) => prev || `| Column A | Column B |\n|----------|----------|\n| Value 1  | Value 2  |`)
  }
  }, [insertType])
  // Debounced autosave
  useEffect(() => {
    if (!title && !body) return

    setIsSaving(true)
    const timeout = setTimeout(() => {
      // Simulate API save (replace with real call)
      console.log('Autosaving...', { title, body })
      setIsSaving(false)
      setSaveMessage('Saved')

      setTimeout(() => setSaveMessage(''), 2000)
    }, 1200)

    return () => clearTimeout(timeout)
  }, [title, body])

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
        placeholder="Start typing your note..."
        className="w-full mt-4 h-[400px] text-gray-700 resize-none outline-none bg-transparent"
      />
    </EditorLayout>
  )
}
