'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { initSocket } from '@/lib/socket'
import { initWebRTC } from '@/lib/rtc'

export default function MeetingPage() {
  const { id } = useParams()
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const roomId = id as string

    const socket = initSocket(roomId)

    const cleanup = initWebRTC({
      roomId,
      socket,
      localVideoRef,
      remoteVideoRef,
    })

    return () => {
      cleanup()
      socket.close()
    }
  }, [id])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Meeting Room: {id}</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <video ref={localVideoRef} autoPlay muted className="w-full md:w-64 rounded-lg border" />
        <video ref={remoteVideoRef} autoPlay className="w-full md:w-64 rounded-lg border" />
      </div>
    </div>
  )
}
