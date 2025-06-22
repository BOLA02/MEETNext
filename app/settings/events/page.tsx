'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
import { toast } from 'sonner'
import { AlertTriangle, X, RotateCcw } from 'lucide-react'

const CAMERA_OPTIONS = ['MacBook HD Camera', 'External USB Camera']
const SPEAKER_OPTIONS = ['Default Speakers', 'Sonarist SST Audio']
const MIC_OPTIONS = ['Internal Microphone', 'External Mic']
const EVENT_TYPE_OPTIONS = ['Hybrid', 'Virtual', 'In-person']
const DURATION_OPTIONS = ['Custom', '30 min', '1 hour']
const PARTICIPANT_LIMIT_OPTIONS = ['49 participants', '49+ participants']
const RINGTONE_OPTIONS = ['Default', 'Chime', 'Pulse']
const SKIN_TONES = ['👍', '✋', '👏']
const REACTION_EMOJIS = ['👍', '✋', '👏', '😂']

const LS_KEY = 'event_settings_v1'
const TEMPLATES_KEY = 'event_templates_v1'

function ResetConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Reset Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to reset all event settings to their default values?
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-800">
                <strong>Warning:</strong> This action cannot be undone. All your custom event preferences will be lost.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EventsSettings() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [search, setSearch] = useState('')
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const [isTestingVideo, setIsTestingVideo] = useState(false)
  const [templates, setTemplates] = useState([])
  const [settings, setSettings] = useState({})
  const [showResetModal, setShowResetModal] = useState(false)

  // Video preview
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')

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
    const savedTemplates = localStorage.getItem(TEMPLATES_KEY)
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }

    const savedSettings = localStorage.getItem(LS_KEY)
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  }, [templates])

  // Video preview from camera
  useEffect(() => {
    let stream: MediaStream | null = null
    if (!videoFile) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = stream
      }).catch((error) => {
        console.error('Error accessing camera:', error)
        toast.error('Could not access camera')
      })
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoFile])

  // Video preview from file
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setVideoUrl(url)
      if (videoRef.current) videoRef.current.srcObject = null
    } else {
      setVideoUrl('')
    }
  }, [videoFile])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      toast.success('Video file loaded successfully')
    }
  }

  const handleChange = useCallback((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }))
    toast.success(`${key} updated`)
  }, [])

  // Test audio functionality
  const testAudio = useCallback(async () => {
    try {
      setIsTestingAudio(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audio = new Audio()
      audio.srcObject = stream
      audio.play()
      
      // Play a test tone
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsTestingAudio(false)
        toast.success('Audio test completed')
      }, 500)
    } catch (error) {
      console.error('Error testing audio:', error)
      toast.error('Could not test audio')
      setIsTestingAudio(false)
    }
  }, [])

  // Test video functionality
  const testVideo = useCallback(async () => {
    try {
      setIsTestingVideo(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsTestingVideo(false)
        toast.success('Video test completed')
      }, 3000)
    } catch (error) {
      console.error('Error testing video:', error)
      toast.error('Could not test video')
      setIsTestingVideo(false)
    }
  }, [])

  // Template management functions
  const saveAsTemplate = useCallback(() => {
    const templateName = prompt('Enter template name:')
    if (templateName) {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        settings: { ...settings },
        createdAt: new Date().toISOString()
      }
      setTemplates(prev => [...prev, newTemplate])
      toast.success(`Template "${templateName}" saved successfully`)
    }
  }, [settings])

  const loadTemplate = useCallback((template) => {
    if (confirm(`Load template "${template.name}"? This will override current settings.`)) {
      setSettings(template.settings)
      toast.success(`Template "${template.name}" loaded successfully`)
    }
  }, [])

  const deleteTemplate = useCallback((templateId) => {
    if (confirm('Delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId))
      toast.success('Template deleted successfully')
    }
  }, [])

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings({})
    toast.success('Settings reset to default')
    setShowResetModal(false)
  }, [])

  // Export/Import settings
  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'event-settings.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Settings exported successfully')
  }, [settings])

  const importSettings = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target.result)
            setSettings(importedSettings)
            toast.success('Settings imported successfully')
          } catch (error) {
            toast.error('Invalid settings file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const match = (text: string) => text.toLowerCase().includes(searchTerm)

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      {/* Video Settings */}
      {(match('video') || match('camera')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Video settings</h2>
          <div className="relative w-full max-w-md mx-auto">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay muted playsInline className="w-full rounded-lg border object-cover h-56" />
            ) : (
              <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-lg border object-cover h-56" />
            )}
            <input type="file" accept="video/*" className="hidden" id="video-upload" onChange={handleFileChange} />
            <label htmlFor="video-upload" className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow cursor-pointer hover:bg-white transition-colors">📷</label>
          </div>
          <div className="flex gap-4 flex-wrap">
            <SettingSelect label="Camera" options={CAMERA_OPTIONS} value={settings.camera || CAMERA_OPTIONS[0]} onChange={v => handleChange('camera', v)} />
            <SettingToggle label="Original ratio" checked={!!settings.originalRatio} onChange={v => handleChange('originalRatio', v)} />
            <SettingToggle label="HD" checked={!!settings.hd} onChange={v => handleChange('hd', v)} />
            <SettingToggle label="Mirror my video" checked={!!settings.mirror} onChange={v => handleChange('mirror', v)} />
            <button 
              onClick={testVideo}
              disabled={isTestingVideo}
              className="px-5 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingVideo ? 'Testing...' : 'Test'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SettingToggle label="Always display participant names on their video" checked={!!settings.displayNames} onChange={v => handleChange('displayNames', v)} />
            <SettingToggle label="Turn off video when joining" checked={!!settings.turnOffVideo} onChange={v => handleChange('turnOffVideo', v)} />
            <SettingToggle label="Always show preview when joining" checked={!!settings.showPreview} onChange={v => handleChange('showPreview', v)} />
            <SettingToggle label="Hide non-video participants" checked={!!settings.hideNonVideo} onChange={v => handleChange('hideNonVideo', v)} />
            <SettingToggle label="Hide self view" checked={!!settings.hideSelf} onChange={v => handleChange('hideSelf', v)} />
            <SettingToggle label="Show me as an active speaker when I talk" checked={!!settings.activeSpeaker} onChange={v => handleChange('activeSpeaker', v)} />
          </div>
        </section>
      )}

      {/* Audio Settings */}
      {(match('audio') || match('microphone') || match('speaker')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Audio settings</h2>
          <div className="flex gap-4 flex-wrap">
            <SettingSelect label="Speakers" options={SPEAKER_OPTIONS} value={settings.speaker || SPEAKER_OPTIONS[0]} onChange={v => handleChange('speaker', v)} />
            <SettingSelect label="Microphone" options={MIC_OPTIONS} value={settings.mic || MIC_OPTIONS[0]} onChange={v => handleChange('mic', v)} />
            <SettingToggle label="Spatial audio" checked={!!settings.spatialAudio} onChange={v => handleChange('spatialAudio', v)} />
            <SettingToggle label="Use separate audio device for ringtone" checked={!!settings.separateRingtone} onChange={v => handleChange('separateRingtone', v)} />
            <button 
              onClick={testAudio}
              disabled={isTestingAudio}
              className="px-5 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingAudio ? 'Testing...' : 'Test'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label>Volume</label>
            <input type="range" min={0} max={100} value={settings.volume || 50} onChange={e => handleChange('volume', +e.target.value)} />
            <SettingToggle label="Automatically adjust microphone volume" checked={!!settings.autoMicVolume} onChange={v => handleChange('autoMicVolume', v)} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Audio profile</h4>
            <SettingRadioGroup
              label="Background noise suppression"
              value={settings.noiseSuppression || 'auto'}
              onChange={v => handleChange('noiseSuppression', v)}
              options={[
                { label: 'Auto', value: 'auto' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />
            <SettingToggle label="Personalized audio isolation" checked={!!settings.audioIsolation} onChange={v => handleChange('audioIsolation', v)} />
            <SettingToggle label="Original sound for musicians" checked={!!settings.originalSound} onChange={v => handleChange('originalSound', v)} />
            <SettingToggle label="Live performance audio" checked={!!settings.livePerformance} onChange={v => handleChange('livePerformance', v)} />
          </div>
          <div className="flex gap-4 flex-wrap">
            <SettingSelect label="Ringtone scheme" options={RINGTONE_OPTIONS} value={settings.ringtone || RINGTONE_OPTIONS[0]} onChange={v => handleChange('ringtone', v)} />
            <SettingToggle label="Automatically join audio by computer when joining" checked={!!settings.autoJoinAudio} onChange={v => handleChange('autoJoinAudio', v)} />
            <SettingToggle label="Mute my microphone when joining" checked={!!settings.muteOnJoin} onChange={v => handleChange('muteOnJoin', v)} />
            <SettingToggle label="Press and hold space key to temporarily unmute yourself" checked={!!settings.spaceUnmute} onChange={v => handleChange('spaceUnmute', v)} />
            <SettingToggle label="Sync button on headset" checked={!!settings.syncHeadset} onChange={v => handleChange('syncHeadset', v)} />
          </div>
        </section>
      )}

      {/* Event Details & Host/Co-host */}
      {(match('event') || match('host') || match('co-host')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Event details</h2>
          <div className="flex gap-4 flex-wrap">
            <SettingSelect label="Event type" options={EVENT_TYPE_OPTIONS} value={settings.eventType || EVENT_TYPE_OPTIONS[0]} onChange={v => handleChange('eventType', v)} />
            <SettingSelect label="Event duration" options={DURATION_OPTIONS} value={settings.eventDuration || DURATION_OPTIONS[0]} onChange={v => handleChange('eventDuration', v)} />
            <SettingSelect label="Participant limit" options={PARTICIPANT_LIMIT_OPTIONS} value={settings.participantLimit || PARTICIPANT_LIMIT_OPTIONS[0]} onChange={v => handleChange('participantLimit', v)} />
            <SettingToggle label="Auto-end the event when time runs out" checked={!!settings.autoEnd} onChange={v => handleChange('autoEnd', v)} />
            <SettingSelect label="Event visibility" options={['Public - Anyone can join', 'Private - Invite only']} value={settings.visibility || 'Public - Anyone can join'} onChange={v => handleChange('visibility', v)} />
          </div>
          <div className="flex gap-4 flex-wrap">
            <SettingToggle label="Assign default co-hosts for recurring events" checked={!!settings.defaultCohosts} onChange={v => handleChange('defaultCohosts', v)} />
            <SettingToggle label="Allow co-hosts to start the event without the main host" checked={!!settings.cohostStart} onChange={v => handleChange('cohostStart', v)} />
          </div>
        </section>
      )}

      {/* Registration & Reminders */}
      {(match('registration') || match('reminder') || match('waitlist')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Registration and reminders</h2>
          <div className="flex gap-4 flex-wrap">
            <SettingToggle label="Open registration (anyone can register)" checked={!!settings.openRegistration} onChange={v => handleChange('openRegistration', v)} />
            <SettingToggle label="Approval-based registration (host manually approves attendees)" checked={!!settings.approvalRegistration} onChange={v => handleChange('approvalRegistration', v)} />
            <SettingToggle label="Registration questions (custom fields for collecting attendee details)" checked={!!settings.registrationQuestions} onChange={v => handleChange('registrationQuestions', v)} />
          </div>
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="block font-medium mb-1">Reminder frequency</label>
              <select className="border rounded px-2 py-1" value={settings.reminderFreq || '1 hour before'} onChange={e => handleChange('reminderFreq', e.target.value)}>
                <option>1 hour before</option>
                <option>1 day before</option>
                <option>10 minutes before</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Include event calendar or links</label>
              <input className="border rounded px-2 py-1" placeholder="Add event calendar link..." value={settings.calendarLink || ''} onChange={e => handleChange('calendarlink', e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Custom reminder message</label>
              <input className="border rounded px-2 py-1" placeholder="Add reminder message..." value={settings.reminderMsg || ''} onChange={e => handleChange('reminderMsg', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <SettingToggle label="Enable a waitlist if the event reaches capacity" checked={!!settings.waitlist} onChange={v => handleChange('waitlist', v)} />
            <SettingToggle label="Auto-invite waitlisted attendees if space opens up" checked={!!settings.autoInviteWaitlist} onChange={v => handleChange('autoInviteWaitlist', v)} />
          </div>
        </section>
      )}

      {/* Event Templates */}
      {(match('template')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Event templates</h2>
          <div className="flex gap-4 flex-wrap">
            <button 
              className="border rounded px-4 py-2 bg-purple-50 hover:bg-purple-100 transition-colors" 
              onClick={saveAsTemplate}
            >
              Save as template
            </button>
            <button 
              className="border rounded px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors" 
              onClick={exportSettings}
            >
              Export settings
            </button>
            <button 
              className="border rounded px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors" 
              onClick={importSettings}
            >
              Import settings
            </button>
            <button 
              className="border rounded px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 transition-colors" 
              onClick={() => setShowResetModal(true)}
            >
              Reset to default
            </button>
          </div>
          
          {/* Saved Templates */}
          {templates.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Saved Templates</h4>
              <div className="grid gap-2">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        onClick={() => loadTemplate(template)}
                      >
                        Load
                      </button>
                      <button 
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Event Interaction & Engagement */}
      {(match('chat') || match('emoji') || match('reaction') || match('poll') || match('survey')) && (
        <section className="bg-white p-6 rounded-lg shadow border space-y-6">
          <h2 className="text-lg font-semibold">Event interaction and engagement</h2>
          <div className="space-y-2">
            <h4 className="font-semibold">Chat & Q&A Settings</h4>
            <SettingToggle label="Enable/disable public chat" checked={!!settings.publicChat} onChange={v => handleChange('publicChat', v)} />
            <SettingToggle label="Moderated Q&A (hosts approve questions before they appear)" checked={!!settings.moderatedQA} onChange={v => handleChange('moderatedQA', v)} />
            <SettingToggle label="Allow anonymous questions" checked={!!settings.anonQuestions} onChange={v => handleChange('anonQuestions', v)} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Polls & Surveys</h4>
            <SettingToggle label="Enable pre-event and post-event surveys" checked={!!settings.surveys} onChange={v => handleChange('surveys', v)} />
            <SettingToggle label="Real-time polling options during events" checked={!!settings.polls} onChange={v => handleChange('polls', v)} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Virtual Reactions & Emoji</h4>
            <div className="flex gap-2 items-center">
              <span>Skin tone:</span>
              {SKIN_TONES.map((tone) => (
                <button 
                  key={tone} 
                  className={`text-2xl px-1 ${settings.skinTone === tone ? 'ring-2 ring-purple-500 rounded' : ''} hover:scale-110 transition-transform`} 
                  onClick={() => handleChange('skinTone', tone)}
                >
                  {tone}
                </button>
              ))}
            </div>
            <SettingToggle label="Allow attendees to send emojis or GIFs in chat" checked={!!settings.allowEmojis} onChange={v => handleChange('allowEmojis', v)} />
            <SettingToggle label={`Restrict reactions to these emojis ${REACTION_EMOJIS.join(' ')}`} checked={!!settings.restrictReactions} onChange={v => handleChange('restrictReactions', v)} />
            <SettingToggle label="Display your reaction above toolbar" checked={!!settings.displayReactionToolbar} onChange={v => handleChange('displayReactionToolbar', v)} />
          </div>
        </section>
      )}

      <ResetConfirmationModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetSettings}
      />
    </div>
  )
}
