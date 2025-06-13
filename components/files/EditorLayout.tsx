'use client'

import FileTopbar from './FileTopbar'
import TextEditor from '../TextEditor'
import DrawingCanvas from './DrawingCanvas'
import { useEditorStore } from '@/lib/store/editorStore'
import { useState, ReactNode } from 'react'

interface EditorLayoutProps {
  children?: ReactNode
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  const { bgColor, imageSrc, checklist, audioURL } = useEditorStore()
  const [showCanvas, setShowCanvas] = useState(false)

  const handleUndo = () => console.log('Undo triggered')
  const handleRedo = () => console.log('Redo triggered')

  return (
    <div className={`px-6 py-4 min-h-screen transition-colors ${bgColor}`}>
      <FileTopbar onUndo={handleUndo} onRedo={handleRedo} setShowCanvas={setShowCanvas} />

      {showCanvas && (
        <div className="my-4">
          <DrawingCanvas />
        </div>
      )}

      {imageSrc && (
        <div className="my-4">
          <img src={imageSrc} alt="Uploaded" className="max-w-full h-auto rounded shadow" />
        </div>
      )}

      {checklist.length > 0 && (
        <div className="my-4 space-y-2">
          <h4 className="font-semibold">Checklist:</h4>
          {checklist.map((item, i) => (
            <label key={i} className="flex gap-2 items-center">
              <input type="checkbox" /> {item}
            </label>
          ))}
        </div>
      )}

      {audioURL && (
        <div className="my-4">
          <h4 className="font-semibold">Audio Note:</h4>
          <audio controls src={audioURL}></audio>
        </div>
      )}

      <TextEditor />

      {children}  {/* <-- this was missing */}
    </div>
  )
}
