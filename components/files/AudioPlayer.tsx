'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex items-center bg-purple-100 rounded-lg p-4 shadow-md gap-4 w-[300px]">
      <button
        onClick={togglePlay}
        className="bg-purple-600 text-white p-3 rounded-full shadow hover:bg-purple-700 transition"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <div className="flex-1">
        <div className="font-semibold text-purple-700">Audio Note</div>
      </div>

      <Volume2 className="text-purple-600" size={14} />

      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  )
}
