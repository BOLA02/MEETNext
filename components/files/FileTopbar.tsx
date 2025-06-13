'use client'

import {
  ArrowLeft, Undo2, Redo2, Share2, MoreVertical, Pin, Palette, Plus, Image as ImageIcon,
  Brush, CheckSquare, Mic
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useState, useRef, ChangeEvent } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import ShareModal from './ShareModal'

interface FileTopbarProps {
  onUndo: () => void
  onRedo: () => void
  setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FileTopbar({ onUndo, onRedo, setShowCanvas }: FileTopbarProps) {
  const router = useRouter()

  const { setBgColor, setImageSrc, addChecklistItem, setAudioURL } = useEditorStore()
  const [isRecording, setIsRecording] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = e => e.data.size > 0 && audioChunks.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/mp3' })
      const url = URL.createObjectURL(blob)
      setAudioURL(url)
      audioChunks.current = []
    }
    recorder.start()
    mediaRecorderRef.current = recorder
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const colors = [
    'bg-white', 'bg-gray-100', 'bg-yellow-200', 'bg-green-200',
    'bg-blue-200', 'bg-red-200', 'bg-pink-200', 'bg-purple-200',
    'bg-orange-200', 'bg-lime-200'
  ]

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/files')}>
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon" onClick={onUndo}><Undo2 /></Button>
        <Button variant="ghost" size="icon" onClick={onRedo}><Redo2 /></Button>
        <Button variant="ghost" size="icon" onClick={() => setShareOpen(true)}><Share2 /></Button>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            <DropdownMenuItem>Copy to</DropdownMenuItem>
            <DropdownMenuItem>Move to</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Save to templates</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon"><Pin /></Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Palette /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="grid grid-cols-5 gap-2 p-2">
            {colors.map(color => (
              <div key={color}
                onClick={() => setBgColor(color)}
                className={`w-6 h-6 rounded ${color} border cursor-pointer hover:scale-110 transition-transform`}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Plus /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <label className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer">
              <ImageIcon size={16} /> Add photo
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </label>

            <DropdownMenuItem onClick={() => setShowCanvas(prev => !prev)}>
              <Brush className="mr-2" size={16} /> Drawing
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              const item = prompt('Add checklist item:')
              if (item) addChecklistItem(item)
            }}>
              <CheckSquare className="mr-2" size={16} /> Tick boxes
            </DropdownMenuItem>

            <DropdownMenuItem onClick={isRecording ? handleStopRecording : handleStartRecording}>
              <Mic className="mr-2" size={16} /> {isRecording ? 'Stop' : 'Add audio'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  )
}
