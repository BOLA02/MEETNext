'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingToggle from '@/components/settings/fields/SettingToggle'
import SettingSelect from '@/components/settings/fields/SettingSelect'
import SettingRadioGroup from '@/components/settings/fields/SettingRadioGroup'

export default function EventsSettings() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [search, setSearch] = useState('')

  const [camera, setCamera] = useState('MacBook HD Camera')
  const [speaker, setSpeaker] = useState('Default Speakers')
  const [micDevice, setMicDevice] = useState('Internal Microphone')
  const [eventType, setEventType] = useState('Hybrid event')
  const [eventDuration, setEventDuration] = useState('Custom duration')
  const [spatialAudio, setSpatialAudio] = useState(true)

  const [enableCohost, setEnableCohost] = useState(false)
  const [galleryLayout, setGalleryLayout] = useState('Grid view')
  const [noiseProfile, setNoiseProfile] = useState('Standard')
  const [recordAuto, setRecordAuto] = useState(false)

  const searchTerm = search.trim().toLowerCase()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })
  }, [])

  const match = (text: string) => text.toLowerCase().includes(searchTerm)

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      {/* Video Settings */}
      {(searchTerm === '' || match('video') || match('camera') || match('microphone') || match('speaker')) && (
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
            {match('camera') && (
              <SettingSelect
                label="Camera"
                options={['MacBook HD Camera', 'External USB Camera']}
                value={camera}
                onChange={setCamera}
              />
            )}

            {match('speaker') && (
              <SettingSelect
                label="Speakers"
                options={['Default Speakers', 'Sonarist SST Audio']}
                value={speaker}
                onChange={setSpeaker}
              />
            )}

            {match('microphone') && (
              <SettingSelect
                label="Microphone"
                options={['Internal Microphone', 'External Mic']}
                value={micDevice}
                onChange={setMicDevice}
              />
            )}

            {match('event type') && (
              <SettingSelect
                label="Event Type"
                options={['Hybrid event', 'In-person', 'Virtual']}
                value={eventType}
                onChange={setEventType}
              />
            )}

            {match('duration') && (
              <SettingSelect
                label="Event Duration"
                options={['Custom duration', '30 min', '1 hour']}
                value={eventDuration}
                onChange={setEventDuration}
              />
            )}

            {match('spatial') && (
              <SettingToggle
                label="Enable spatial audio"
                checked={spatialAudio}
                onChange={setSpatialAudio}
              />
            )}
          </div>
        </section>
      )}

      {/* Event Controls */}
      {(searchTerm === '' || match('co-host') || match('gallery') || match('noise') || match('record')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Advanced Event Controls</h2>

          <div className="max-w-md space-y-4">
            {match('co-host') && (
              <SettingToggle
                label="Enable co-host controls"
                checked={enableCohost}
                onChange={setEnableCohost}
              />
            )}

            {match('gallery') && (
              <SettingRadioGroup
                label="Gallery layout"
                value={galleryLayout}
                onChange={setGalleryLayout}
                options={[
                  { label: 'Grid view', value: 'Grid view' },
                  { label: 'Speaker view', value: 'Speaker view' },
                  { label: 'Sidebar view', value: 'Sidebar view' },
                ]}
              />
            )}

            {match('noise') && (
              <SettingRadioGroup
                label="Noise profile"
                value={noiseProfile}
                onChange={setNoiseProfile}
                options={[
                  { label: 'Standard', value: 'Standard' },
                  { label: 'Low background noise', value: 'Low background noise' },
                  { label: 'High background noise', value: 'High background noise' },
                ]}
              />
            )}

            {match('record') && (
              <SettingToggle
                label="Auto-record meeting"
                checked={recordAuto}
                onChange={setRecordAuto}
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}
