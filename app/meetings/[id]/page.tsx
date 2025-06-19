'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, Video, VideoOff, Settings, Copy, UserPlus, PhoneOff, Hand, Smile, Captions, MoreHorizontal, Share2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

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
  const [localStream, setLocalStream] = useState(null)
  const [handRaised, setHandRaised] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [showStickers, setShowStickers] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState(null)
  const socketRef = useRef(null)
  const [reactions, setReactions] = useState({})
  const [showChat, setShowChat] = useState(false)
  const [chatMode, setChatMode] = useState('public') // 'public' | 'private'
  const [hostId, setHostId] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [dmTarget, setDmTarget] = useState(null) // participant id for DM

  // Load user from localStorage/sessionStorage on client only
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}')
    let name = settings.firstName && settings.lastName ? `${settings.firstName} ${settings.lastName}` : ''
    if (!name) {
      // Try sessionStorage (from join form)
      const tempName = sessionStorage.getItem('meetio_temp_name')
      if (tempName) name = tempName
    }
    // Always generate a unique ID for this user in this session
    let myId = sessionStorage.getItem('meetio_user_id')
    if (!myId) {
      myId = uuidv4()
      sessionStorage.setItem('meetio_user_id', myId)
    }
    // Fallback avatar: use initials if not set
    function getInitialsAvatar(name) {
      if (!name) return '/avatar-demo.jpg'
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
      // Use a simple SVG for initials
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=232323&color=fff&size=128&rounded=true`
    }
    const me = {
      id: myId,
      name: name || 'You',
      avatar: settings.avatar || getInitialsAvatar(name),
      isMe: true,
      mic: micOn,
      video: videoOn,
    }
    setUser(me)
  }, [])

  // Socket.IO: join room and sync participants
  useEffect(() => {
    if (!user || !id) return
    // Connect only once
    if (!socketRef.current) {
      socketRef.current = io('ws://localhost:4000')
    }
    const socket = socketRef.current
    socket.emit('join-room', { roomId: id, user: { id: user.id, name: user.name, avatar: user.avatar, mic: micOn, video: videoOn } })
    socket.on('participants', (list) => {
      setParticipants(list.map((p) => ({ ...p, isMe: p.id === user.id })))
    })
    socket.on('reaction', ({ userId, emoji }) => {
      setReactions((prev) => ({ ...prev, [userId]: emoji }))
      if (userId === user.id) {
        setSelectedSticker(emoji)
        setTimeout(() => setSelectedSticker(null), 2000)
      }
      setTimeout(() => setReactions((prev) => {
        const copy = { ...prev }; delete copy[userId]; return copy;
      }), 2000)
    })
    socket.on('state-update', ({ userId, mic, video }) => {
      setParticipants((prev) => prev.map(p => p.id === userId ? { ...p, mic, video } : p))
    })
    // Chat events
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    socket.on('chat-mode', ({ mode, hostId }) => {
      setChatMode(mode)
      setHostId(hostId)
      if (mode === 'public') setDmTarget(null)
    })
    return () => {
      socket.emit('leave-room', { roomId: id })
      socket.disconnect()
    }
  }, [user, id])

  // Keep mic/video state in sync with self in participants and broadcast
  useEffect(() => {
    if (!user || !socketRef.current) return
    setParticipants((prev) => prev.map(p => p.isMe ? { ...p, mic: micOn, video: videoOn } : p))
    socketRef.current.emit('state-update', { roomId: id, userId: user.id, mic: micOn, video: videoOn })
  }, [micOn, videoOn, user, id])

  useEffect(() => {
    setShowGrid(participants.length > 1)
  }, [participants])

  // Show webcam feed when video is on
  useEffect(() => {
    let stream;
    if (videoOn && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(s => {
        stream = s;
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      });
    } else if (localVideoRef.current) {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      localVideoRef.current.srcObject = null;
    }
    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };
  }, [videoOn]);

  // Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    toast.success('Meeting link copied!')
    setTimeout(() => setCopied(false), 1500)
  }

  // Toolbar actions
  const handleToggleMic = () => setMicOn((v) => !v)
  const handleToggleVideo = () => setVideoOn((v) => !v)
  const handleLeave = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    router.push('/')
  }
  const handleRaiseHand = () => {
    setHandRaised(true)
    toast('You raised your hand ✋')
    setTimeout(() => setHandRaised(false), 3000)
  }
  const handleStickers = () => setShowStickers((v) => !v)
  const handleCaptions = () => setCaptionsOn((v) => !v)
  const handleMore = () => {}

  // Stickers modal
  // Google Meet style emoji stickers (from screenshot)
  const stickers = [
    '💖', // Heart with stars
    '👍', // Thumbs up
    '🎉', // Party popper
    '👏', // Clapping hands
    '😂', // Laughing
    '😮', // Surprised
    '😢', // Crying
    '🤔', // Thinking
    '👎', // Thumbs down
  ]
  const handleSelectSticker = (emoji) => {
    setShowStickers(false)
    if (socketRef.current && user) {
      socketRef.current.emit('reaction', { roomId: id, userId: user.id, emoji })
    }
  }

  // Send chat message
  const sendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const msg = {
      roomId: id,
      sender: { id: user.id, name: user.name, avatar: user.avatar },
      recipientId: chatMode === 'private' ? dmTarget : null,
      content: chatInput,
      timestamp: Date.now(),
    }
    socketRef.current.emit('chat-message', msg)
    setChatInput('')
  }

  // Host toggles chat mode
  const toggleChatMode = () => {
    if (user.id !== hostId) return
    const newMode = chatMode === 'public' ? 'private' : 'public'
    socketRef.current.emit('chat-mode', { roomId: id, mode: newMode })
  }

  if (!user) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-[#232323]"><div className="w-10 h-10 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col relative">
      {/* Minimal header */}
      <div className="absolute top-6 left-8 text-white/80 text-sm font-medium">Meetio call</div>

      {/* Centered avatar/video and info */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Hand raised indicator */}
        {handRaised && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-yellow-200 text-yellow-900 px-6 py-2 rounded-full shadow font-semibold text-lg animate-bounce">✋ Hand Raised</div>
        )}
        {/* Captions on indicator */}
        {captionsOn && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-20 bg-blue-600 text-white px-6 py-2 rounded-full shadow font-semibold text-lg">Captions On</div>
        )}
        {/* Sticker indicator: only for local user, bottom center */}
        {selectedSticker && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-32 z-50 text-5xl animate-sticker-fly pointer-events-none select-none drop-shadow-lg">
            {selectedSticker}
          </div>
        )}
        {/* Responsive grid for 2+ participants, solo view for 1 */}
        {participants.length > 1 ? (
          <div className={`grid gap-8 mb-8 transition-all duration-300 ${participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {participants.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center transition-all duration-300">
                  {/* Only show local video for self, avatar for others */}
                  {p.isMe && videoOn ? (
                    <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover rounded-2xl bg-black" />
                  ) : (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  )}
                  {/* Show reaction if present (for others only) */}
                  {!p.isMe && reactions[p.id] && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-30 text-4xl animate-sticker-fly pointer-events-none select-none drop-shadow-lg">
                      {reactions[p.id]}
                    </div>
                  )}
                  {/* Mic/Video state */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 rounded-full px-3 py-1 shadow items-center">
                    <span>{p.mic ? <Mic className="text-gray-700 w-4 h-4" /> : <MicOff className="text-red-500 w-4 h-4" />}</span>
                    <span>{p.video ? <Video className="text-gray-700 w-4 h-4" /> : <VideoOff className="text-red-500 w-4 h-4" />}</span>
                  </div>
                </div>
                <div className="text-white text-base font-medium mt-2 text-center max-w-[120px] truncate">{p.name}{p.isMe && ' (You)'}</div>
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
          <ToolbarButton icon={<Smile />} label="Stickers" onClick={handleStickers} active={showStickers} />
          <ToolbarButton icon={<MessageCircle />} label="Chat" onClick={() => setShowChat((v) => !v)} active={showChat} />
          <ToolbarButton icon={<Captions />} label="Captions" onClick={handleCaptions} red={captionsOn} />
          <ToolbarButton icon={<MoreHorizontal />} label="More" onClick={handleMore} />
        </div>
        {/* Date/time bottom left */}
        <div className="absolute left-8 bottom-2 text-xs text-white/70">
          {dateStr} • {timeStr}
        </div>
      </div>

      {/* Stickers bar (Google Meet style) */}
      {showStickers && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-40 flex items-center justify-center">
          <div className="flex gap-1 bg-[#232323] rounded-full shadow-2xl px-2 py-1 border border-black/30
            transition-all duration-300 ease-out
            animate-stickerbar-in"
          >
            {stickers.map((emoji) => (
              <button key={emoji} className="text-xl md:text-2xl w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/20 transition outline-none border-2 border-transparent focus:border-white" onClick={() => handleSelectSticker(emoji)}>{emoji}</button>
            ))}
          </div>
        </div>
      )}

      {/* Chat sidebar */}
      {showChat && (
        <div className="fixed top-0 right-0 h-full w-[350px] bg-white border-l z-50 flex flex-col shadow-2xl animate-slide-in">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold text-lg">Chat</div>
            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-black text-xl">×</button>
          </div>
          {/* Host toggle */}
          {user.id === hostId && (
            <div className="px-4 py-2 border-b flex items-center gap-2">
              <span className="text-sm font-medium">Mode:</span>
              <button onClick={toggleChatMode} className={`px-3 py-1 rounded-full text-xs font-semibold ${chatMode === 'public' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{chatMode === 'public' ? 'Public' : 'Private'}</button>
              <span className="text-xs text-gray-400">(Host only)</span>
            </div>
          )}
          {/* Private mode: select DM target */}
          {chatMode === 'private' && (
            <div className="px-4 py-2 border-b">
              <div className="text-xs text-gray-500 mb-1">Send to:</div>
              <div className="flex flex-wrap gap-2">
                {participants.filter(p => !p.isMe).map(p => (
                  <button key={p.id} onClick={() => setDmTarget(p.id)} className={`px-2 py-1 rounded-full text-xs font-medium border ${dmTarget === p.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{p.name}</button>
                ))}
              </div>
            </div>
          )}
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
            {messages.filter(m => chatMode === 'public' ? true : (m.recipientId === user.id || m.sender.id === user.id)).map((m, i) => (
              <div key={i} className={`flex ${m.sender.id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg shadow text-sm ${m.sender.id === user.id ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                  <div className="font-semibold text-xs mb-1 flex items-center gap-2">
                    <img src={m.sender.avatar} alt={m.sender.name} className="w-5 h-5 rounded-full inline-block mr-1" />
                    {m.sender.name}
                  </div>
                  <div>{m.content}</div>
                  <div className="text-[10px] text-right text-gray-400 mt-1">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Chat input */}
          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2 bg-white">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={chatMode === 'public' ? 'Message everyone...' : dmTarget ? `Message ${participants.find(p => p.id === dmTarget)?.name || ''}...` : 'Select a participant...'}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatMode === 'private' && !dmTarget}
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-semibold disabled:opacity-50" disabled={!chatInput.trim() || (chatMode === 'private' && !dmTarget)}>Send</button>
          </form>
        </div>
      )}
    </div>
  )
}

function ToolbarButton({ icon, label, onClick, red = false, active = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        className={`rounded-full w-14 h-14 ${red ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-black'} shadow ${active ? 'bg-white/90' : ''}`}
        size="icon"
        onClick={onClick}
      >
        {icon}
      </Button>
      <span className="text-xs mt-1 text-black/80 whitespace-nowrap">{label}</span>
    </div>
  )
}
