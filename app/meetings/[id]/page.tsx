'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, Video, VideoOff, Settings, Copy, UserPlus, PhoneOff, Hand, Smile, Captions, MoreHorizontal, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Remove mock participants, only show self
const otherParticipants = []

export default function MeetingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(false)
  const [user, setUser] = useState(null)
  const [participants, setParticipants] = useState([])
  const [showGrid, setShowGrid] = useState(false)
  const meetingLink = `meetio.com/${id}`
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const localVideoRef = useRef(null)

  // Load user from localStorage on client only
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}')
    const me = {
      id: 'me',
      name: settings.firstName && settings.lastName ? `${settings.firstName} ${settings.lastName}` : 'You',
      avatar: settings.avatar || '/avatar-demo.jpg',
      isMe: true,
      mic: micOn,
      video: videoOn,
    }
    setUser(me)
    setParticipants([me])
  }, [])

  // Keep mic/video state in sync with self in participants
  useEffect(() => {
    if (!user) return
    setParticipants((prev) => prev.map(p => p.isMe ? { ...p, mic: micOn, video: videoOn } : p))
  }, [micOn, videoOn, user])

  useEffect(() => {
    setShowGrid(participants.length > 1)
  }, [participants])

  // Show webcam feed when video is on
  useEffect(() => {
    if (videoOn && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
        localVideoRef.current.srcObject = stream
      })
    } else if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
  }, [videoOn])

  // Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Toolbar actions
  const handleToggleMic = () => setMicOn((v) => !v)
  const handleToggleVideo = () => setVideoOn((v) => !v)
  const handleLeave = () => router.push('/')
  // Placeholder actions
  const handleRaiseHand = () => {}
  const handleStickers = () => {}
  const handleCaptions = () => {}
  const handleMore = () => {}

  if (!user) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-[#232323]"><div className="w-10 h-10 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col relative">
      {/* Minimal header */}
      <div className="absolute top-6 left-8 text-white/80 text-sm font-medium">Meetio call</div>

      {/* Centered avatar/video and info */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {showGrid ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 transition-all duration-300">
            {participants.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center transition-all duration-300">
                  {p.video ? (
                    <video autoPlay muted className="w-full h-full object-cover rounded-full bg-black" />
                  ) : (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  )}
                  {/* Mic/Video state */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 rounded-full px-3 py-1 shadow items-center">
                    <span>{p.mic ? <Mic className="text-gray-700 w-4 h-4" /> : <MicOff className="text-red-500 w-4 h-4" />}</span>
                    <span>{p.video ? <Video className="text-gray-700 w-4 h-4" /> : <VideoOff className="text-red-500 w-4 h-4" />}</span>
                  </div>
                </div>
                <div className="text-white text-base font-medium mt-2">{p.name}{p.isMe && ' (You)'}</div>
              </div>
            ))}
          </div>
        ) : videoOn ? (
          <div className="relative flex flex-col items-center mb-4 w-full h-full justify-center transition-all duration-300">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-[96vw] h-[80vh] max-w-5xl max-h-[85vh] object-cover rounded-3xl bg-black shadow-2xl border-4 border-white transition-all duration-300"
            />
            {/* Overlay bar */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex gap-3 bg-white/90 rounded-full px-4 py-2 shadow items-center">
              <Button size="icon" variant="ghost" className={micOn ? 'text-gray-700' : 'text-red-500'} onClick={handleToggleMic} title={micOn ? 'Mute' : 'Unmute'}>{micOn ? <Mic /> : <MicOff />}</Button>
              <Button size="icon" variant="ghost" className={videoOn ? 'text-gray-700' : 'text-red-500'} onClick={handleToggleVideo} title={videoOn ? 'Stop video' : 'Start video'}>{videoOn ? <Video /> : <VideoOff />}</Button>
              <Button size="icon" variant="ghost" className="text-gray-700"><Settings /></Button>
            </div>
            <div className="text-white text-2xl font-semibold mt-6 transition-all duration-300">{user.name}</div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center mb-4 transition-all duration-300">
            <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-800 flex items-center justify-center transition-all duration-300">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {/* Overlay bar */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex gap-3 bg-white/90 rounded-full px-4 py-2 shadow items-center">
              <Button size="icon" variant="ghost" className={micOn ? 'text-gray-700' : 'text-red-500'} onClick={handleToggleMic} title={micOn ? 'Mute' : 'Unmute'}>{micOn ? <Mic /> : <MicOff />}</Button>
              <Button size="icon" variant="ghost" className={videoOn ? 'text-gray-700' : 'text-red-500'} onClick={handleToggleVideo} title={videoOn ? 'Stop video' : 'Start video'}>{videoOn ? <Video /> : <VideoOff />}</Button>
              <Button size="icon" variant="ghost" className="text-gray-700"><Settings /></Button>
            </div>
            <div className="text-white text-2xl font-semibold mt-6 transition-all duration-300">{user.name}</div>
          </div>
        )}
        {/* Meeting info card: only show if grid (not solo) */}
        {showGrid && (
          <div className="bg-white rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center w-[350px] mb-8 transition-all duration-300">
            <div className="font-semibold text-gray-800 mb-2">Your meeting has started</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-100 px-3 py-2 rounded text-sm text-gray-700 font-mono select-all">
                {meetingLink}
              </div>
              <Button size="icon" variant="ghost" className="text-purple-600" onClick={handleCopy} title="Copy link">
                <Copy />
              </Button>
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold flex items-center gap-2 justify-center mb-2">
              <UserPlus className="h-5 w-5" /> Add more people
            </Button>
            <div className="text-xs text-gray-500 text-center">People you share this link with can join automatically</div>
            {copied && <div className="text-green-600 text-xs mt-2">Copied!</div>}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center pb-6">
        <div className="flex gap-4 bg-white/95 rounded-full px-6 py-3 shadow-lg border items-center">
          <ToolbarButton icon={micOn ? <Mic /> : <MicOff />} label={micOn ? 'Mute' : 'Unmute'} onClick={handleToggleMic} red={!micOn} />
          <ToolbarButton icon={videoOn ? <Video /> : <VideoOff />} label={videoOn ? 'Stop video' : 'Start video'} onClick={handleToggleVideo} red={!videoOn} />
          <ToolbarButton icon={<Share2 />} label="Share" onClick={handleCopy} />
          <ToolbarButton icon={<PhoneOff />} label="Leave call" onClick={handleLeave} red />
          <ToolbarButton icon={<Hand />} label="Raise hand" onClick={handleRaiseHand} />
          <ToolbarButton icon={<Smile />} label="Stickers" onClick={handleStickers} />
          <ToolbarButton icon={<Captions />} label="Captions" onClick={handleCaptions} />
          <ToolbarButton icon={<MoreHorizontal />} label="More" onClick={handleMore} />
        </div>
        {/* Date/time bottom left */}
        <div className="absolute left-8 bottom-2 text-xs text-white/70">
          {dateStr} • {timeStr}
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({ icon, label, onClick, red = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        className={`rounded-full w-14 h-14 ${red ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-black'} shadow`}
        size="icon"
        onClick={onClick}
      >
        {icon}
      </Button>
      <span className="text-xs mt-1 text-black/80 whitespace-nowrap">{label}</span>
    </div>
  )
}
