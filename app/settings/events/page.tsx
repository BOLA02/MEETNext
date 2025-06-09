'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function EventsSettings() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState('MacBook HD Camera')
  const [speaker, setSpeaker] = useState('Default Speakers')
  const [micDevice, setMicDevice] = useState('Internal Microphone')
  const [eventType, setEventType] = useState('Hybrid event')
  const [eventDuration, setEventDuration] = useState('Custom duration')

  // other state values (simplified for clarity)
  const [spatialAudio, setSpatialAudio] = useState(true)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })
  }, [])

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <h1 className="text-xl font-semibold">Account / Settings</h1>

      <section className="bg-white p-6 rounded-lg shadow border space-y-6">
        <h2 className="text-lg font-semibold">Video Settings</h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg border object-cover h-80"
        />

        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Camera</label>
            <Select value={camera} onValueChange={setCamera}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MacBook HD Camera">MacBook HD Camera</SelectItem>
                <SelectItem value="External USB Camera">External USB Camera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Speakers</label>
            <Select value={speaker} onValueChange={setSpeaker}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select speakers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default Speakers">Default Speakers</SelectItem>
                <SelectItem value="Sonarist SST Audio">Sonarist SST Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Microphone</label>
            <Select value={micDevice} onValueChange={setMicDevice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internal Microphone">Internal Microphone</SelectItem>
                <SelectItem value="External Mic">External Mic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Event Type</label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hybrid event">Hybrid event</SelectItem>
                <SelectItem value="In-person">In-person</SelectItem>
                <SelectItem value="Virtual">Virtual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Event Duration</label>
            <Select value={eventDuration} onValueChange={setEventDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom duration">Custom duration</SelectItem>
                <SelectItem value="30 min">30 min</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              checked={spatialAudio}
              onCheckedChange={(checked) => setSpatialAudio(!!checked)}
            />
            <span className="text-gray-700">Enable spatial audio</span>
          </div>
        </div>
      </section>
    </div>
  )
}
