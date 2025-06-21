'use client'

import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, Video, VideoOff, Settings, Copy, UserPlus, PhoneOff, Hand, Smile, Captions, MoreHorizontal, Share2, MessageCircle, Paperclip, SmilePlus, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

// Lazy load the heavy emoji picker component
const Picker = lazy(() => import('@emoji-mart/react'))

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
  const meetingLink = useMemo(() => `meetio.com/${id}`, [id])
  const now = useMemo(() => new Date(), [])
  const dateStr = useMemo(() => now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), [now])
  const timeStr = useMemo(() => now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), [now])
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
  const [unreadCount, setUnreadCount] = useState(0)
  const [typingUsers, setTypingUsers] = useState([])
  const [uploading, setUploading] = useState(false)
  const [messageReactions, setMessageReactions] = useState({}) // { [messageId]: [{emoji, userId}] }
  const [showReactionPicker, setShowReactionPicker] = useState(null) // messageId or null
  const [pinnedMessageId, setPinnedMessageId] = useState(null)
  const [search, setSearch] = useState('')
  const [onlineUserIds, setOnlineUserIds] = useState([])
  const [readReceipts, setReadReceipts] = useState({}) // { [messageId]: [userId] }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Memoized user initialization function
  const initializeUser = useCallback(() => {
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
  }, [micOn, videoOn])

  // Load user from localStorage/sessionStorage on client only
  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  // Memoized socket event handlers
  const handleParticipants = useCallback((list) => {
    setParticipants(list.map((p) => ({ ...p, isMe: p.id === user?.id })))
  }, [user?.id])

  const handleReaction = useCallback(({ userId, emoji }) => {
    setReactions((prev) => ({ ...prev, [userId]: emoji }))
    if (userId === user?.id) {
      setSelectedSticker(emoji)
      setTimeout(() => setSelectedSticker(null), 2000)
    }
    setTimeout(() => setReactions((prev) => {
      const copy = { ...prev }; delete copy[userId]; return copy;
    }), 2000)
  }, [user?.id])

  const handleStateUpdate = useCallback(({ userId, mic, video }) => {
    setParticipants((prev) => prev.map(p => p.id === userId ? { ...p, mic, video } : p))
  }, [])

  const handleChatMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg])
    // Unread badge logic
    if (!showChat) setUnreadCount((c) => c + 1)
  }, [showChat])

  // Socket.IO: join room and sync participants
  useEffect(() => {
    if (!user || !id) return
    // Connect only once
    if (!socketRef.current) {
      socketRef.current = io('ws://localhost:5000')
    }
    const socket = socketRef.current
    socket.emit('join-room', { roomId: id, user: { id: user.id, name: user.name, avatar: user.avatar, mic: micOn, video: videoOn } })
    socket.on('participants', handleParticipants)
    socket.on('reaction', handleReaction)
    socket.on('state-update', handleStateUpdate)
    // Chat events
    socket.on('chat-message', handleChatMessage)
    socket.on('chat-reaction', ({ messageId, emoji, userId }) => {
      setMessageReactions((prev) => {
        const arr = prev[messageId] ? [...prev[messageId]] : []
        // Only one reaction per user per message
        const filtered = arr.filter(r => r.userId !== userId)
        return { ...prev, [messageId]: [...filtered, { emoji, userId }] }
      })
    })
    socket.on('pin-message', ({ messageId }) => {
      setPinnedMessageId(messageId)
    })
    socket.on('chat-mode', ({ mode, hostId }) => {
      setChatMode(mode)
      setHostId(hostId)
      if (mode === 'public') setDmTarget(null)
    })
    // Typing indicator
    socket.on('typing', ({ userId, name }) => {
      if (userId === user.id) return
      setTypingUsers((prev) => Array.from(new Set([...prev, name])))
      setTimeout(() => setTypingUsers((prev) => prev.filter(n => n !== name)), 2000)
    })
    socket.on('online-users', (ids) => {
      setOnlineUserIds(ids)
    })
    socket.on('read-receipt', ({ messageId, userIds }) => {
      setReadReceipts((prev) => ({ ...prev, [messageId]: userIds }))
    })
    return () => {
      socket.emit('leave-room', { roomId: id })
      socket.disconnect()
    }
  }, [user, id, showChat, handleParticipants, handleReaction, handleStateUpdate, handleChatMessage, micOn, videoOn])

  // Reset unread count when chat is opened
  useEffect(() => {
    if (showChat) setUnreadCount(0)
  }, [showChat])

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

  // Memoized handlers
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    toast.success('Meeting link copied!')
    setTimeout(() => setCopied(false), 1500)
  }, [meetingLink])

  const handleToggleMic = useCallback(() => setMicOn((v) => !v), [])
  const handleToggleVideo = useCallback(() => setVideoOn((v) => !v), [])
  
  const handleLeave = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    router.push('/')
  }, [localStream, router])

  const handleRaiseHand = useCallback(() => {
    setHandRaised((v) => !v)
    if (socketRef.current) {
      socketRef.current.emit('reaction', { roomId: id, userId: user?.id, emoji: handRaised ? null : '✋' })
    }
  }, [handRaised, id, user?.id])

  const handleStickers = useCallback(() => setShowStickers((v) => !v), [])
  const handleCaptions = useCallback(() => setCaptionsOn((v) => !v), [])
  const handleMore = useCallback(() => {}, [])

  const handleSelectSticker = useCallback((emoji) => {
    setSelectedSticker(emoji)
    if (socketRef.current) {
      socketRef.current.emit('reaction', { roomId: id, userId: user?.id, emoji })
    }
    setTimeout(() => setSelectedSticker(null), 2000)
  }, [id, user?.id])

  const sendMessage = useCallback((e, fileUrl = null, fileType = null, fileName = null) => {
    e.preventDefault()
    if (!chatInput.trim() && !fileUrl) return
    const msg = {
      id: uuidv4(),
      text: chatInput,
      userId: user?.id,
      userName: user?.name,
      userAvatar: user?.avatar,
      timestamp: Date.now(),
      fileUrl,
      fileType,
      fileName,
      isPrivate: chatMode === 'private' && dmTarget,
      dmTarget
    }
    if (socketRef.current) {
      socketRef.current.emit('chat-message', { roomId: id, message: msg })
    }
    setChatInput('')
  }, [chatInput, user, chatMode, dmTarget, id])

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      // Simulate file upload - replace with actual upload logic
      const fileUrl = URL.createObjectURL(file)
      sendMessage(e, fileUrl, file.type, file.name)
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }, [sendMessage])

  const toggleChatMode = useCallback(() => {
    if (socketRef.current) {
      const newMode = chatMode === 'public' ? 'private' : 'public'
      socketRef.current.emit('chat-mode', { roomId: id, mode: newMode, hostId: user?.id })
    }
  }, [chatMode, id, user?.id])

  const handleTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { roomId: id, userId: user?.id, name: user?.name })
    }
  }, [id, user?.id, user?.name])

  const sendReaction = useCallback((messageId, emoji) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-reaction', { roomId: id, messageId, emoji, userId: user?.id })
    }
  }, [id, user?.id])

  const pinMessage = useCallback((messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('pin-message', { roomId: id, messageId, hostId: user?.id })
    }
  }, [id, user?.id])

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
        <div className="flex gap-3 bg-white/95 rounded-full px-6 py-3 shadow-2xl border-2 border-gray-200 items-center">
          <ToolbarButton icon={micOn ? <Mic /> : <MicOff />} label={micOn ? 'Mute' : 'Unmute'} onClick={handleToggleMic} red={!micOn} />
          <ToolbarButton icon={videoOn ? <Video /> : <VideoOff />} label={videoOn ? 'Stop video' : 'Start video'} onClick={handleToggleVideo} red={!videoOn} />
          <ToolbarButton icon={<Share2 />} label="Share" onClick={handleCopy} />
          <ToolbarButton icon={<PhoneOff />} label="Leave call" onClick={handleLeave} red />
          <ToolbarButton icon={<Hand />} label="Raise hand" onClick={handleRaiseHand} />
          <ToolbarButton icon={<Smile />} label="Stickers" onClick={handleStickers} active={showStickers} />
          <ToolbarButton icon={<MessageCircle />} label="Chat" onClick={() => setShowChat((v) => !v)} active={showChat} unread={unreadCount} />
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
        <div className="fixed top-0 right-0 h-full w-[370px] bg-white border-l z-50 flex flex-col shadow-2xl animate-slide-in rounded-l-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold text-lg">Chat</div>
            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-black text-xl">×</button>
          </div>
          {/* Info text */}
          <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">You can pin chats to make them more visible for everyone in the meeting</div>
          {/* Host toggle */}
          {user.id === hostId && (
            <div className="px-4 py-2 border-b flex items-center gap-2">
              <span className="text-sm font-medium">Mode:</span>
              <button onClick={toggleChatMode} className={`px-3 py-1 rounded-full text-xs font-semibold ${chatMode === 'public' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{chatMode === 'public' ? 'Public' : 'Private'}</button>
              <span className="text-xs text-gray-400">(Host only)</span>
            </div>
          )}
          {/* Private mode: DM dropdown */}
          {chatMode === 'private' && (
            <div className="px-4 py-2 border-b">
              <div className="text-xs text-gray-500 mb-1">Send message to:</div>
              <div className="relative">
                <button onClick={() => setDmTarget(dmTarget ? null : participants.find(p => !p.isMe)?.id)} className="w-full flex items-center gap-2 px-3 py-2 border rounded bg-gray-100 text-sm">
                  {dmTarget ? (
                    <>
                      <img src={participants.find(p => p.id === dmTarget)?.avatar} className="w-6 h-6 rounded-full" />
                      <span>{participants.find(p => p.id === dmTarget)?.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Select participant...</span>
                  )}
                  <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dmTarget === null && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {participants.filter(p => !p.isMe).map(p => (
                      <button key={p.id} onClick={() => setDmTarget(p.id)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
                        <img src={p.avatar} className="w-6 h-6 rounded-full" />
                        <span>{p.name}</span>
                        {onlineUserIds.includes(p.id) && <span className="ml-auto w-2 h-2 rounded-full bg-green-500"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Pinned message */}
          {pinnedMessageId && (
            (() => {
              const m = messages.find(msg => (msg.timestamp + '-' + (msg.sender.id || '')) === pinnedMessageId)
              if (!m) return null
              return (
                <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 flex items-center gap-2">
                  <Pin className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 text-xs">Pinned:</span>
                  <span className="text-xs text-yellow-900 truncate">{m.content || m.fileName || 'Pinned message'}</span>
                </div>
              )
            })()
          )}
          {/* Search bar */}
          <div className="px-4 py-2 border-b bg-gray-50">
            <input
              type="text"
              className="w-full border rounded px-3 py-1 text-sm"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
            {messages
              .filter(m => chatMode === 'public' ? true : (m.recipientId === user.id || m.sender.id === user.id))
              .filter(m => {
                if (!search.trim()) return true
                const msgText = (m.content || '') + ' ' + (m.sender.name || '') + ' ' + (m.fileName || '')
                return msgText.toLowerCase().includes(search.toLowerCase())
              })
              .map((m, i) => {
                const msgId = m.timestamp + '-' + (m.sender.id || '')
                return (
                  <div key={i} className={`flex ${m.sender.id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-lg shadow text-sm ${m.sender.id === user.id ? 'bg-blue-500 text-white' : 'bg-white border'} relative`}>
                      <div className="font-semibold text-xs mb-1 flex items-center gap-2">
                        <img src={m.sender.avatar} alt={m.sender.name} className="w-5 h-5 rounded-full inline-block mr-1" />
                        {m.sender.name}
                      </div>
                      {m.type === 'image' && m.fileUrl ? (
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                          <img src={m.fileUrl} alt={m.fileName || 'image'} className="max-w-[180px] max-h-[120px] rounded mb-1 border" />
                        </a>
                      ) : m.type === 'file' && m.fileUrl ? (
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                          <Paperclip className="w-4 h-4 inline-block" />
                          {m.fileName || 'Download file'}
                        </a>
                      ) : (
                        <div>{m.content}</div>
                      )}
                      {/* Pin button (host only) */}
                      {user.id === hostId && (
                        <button type="button" className="absolute top-1 left-1 text-yellow-600 hover:text-yellow-800" title="Pin message" onClick={() => pinMessage(msgId)}>
                          <Pin className="w-4 h-4" />
                        </button>
                      )}
                      {/* Reactions display */}
                      {messageReactions[msgId] && messageReactions[msgId].length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {messageReactions[msgId].map((r, idx) => (
                            <span key={idx} className="text-lg bg-gray-100 rounded-full px-2 py-0.5 border border-gray-200">{r.emoji}</span>
                          ))}
                        </div>
                      )}
                      {/* Reaction picker button */}
                      <button type="button" className="absolute top-1 right-1 text-gray-400 hover:text-yellow-500" onClick={() => setShowReactionPicker(msgId)}>
                        <SmilePlus className="w-5 h-5" />
                      </button>
                      {/* Reaction picker popover */}
                      {showReactionPicker === msgId && (
                        <div className="absolute top-7 right-0 bg-white border rounded shadow-lg p-2 flex gap-1 z-50">
                          {["👍","😂","🎉","👏","❤️","😮","😢","🤔","👎"].map(e => (
                            <button key={e} className="text-xl hover:scale-125 transition" onClick={() => sendReaction(msgId, e)}>{e}</button>
                          ))}
                        </div>
                      )}
                      {/* Read receipts (seen by) */}
                      {readReceipts[msgId] && readReceipts[msgId].length > 0 && m.sender.id === user.id && (
                        <div className="text-[10px] text-green-600 mt-1">Seen by {readReceipts[msgId].length}</div>
                      )}
                      <div className="text-[10px] text-right text-gray-400 mt-1">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                )
              })}
          </div>
          {/* Chat input */}
          <form onSubmit={sendMessage} className="p-3 border-t flex items-center gap-2 bg-white relative">
            <label className="flex items-center cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              <Paperclip className={`w-5 h-5 mr-2 ${uploading ? 'animate-spin' : ''}`} />
            </label>
            <input
              type="text"
              className="flex-1 min-w-0 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={chatMode === 'public' ? 'Message everyone...' : dmTarget ? `Message ${participants.find(p => p.id === dmTarget)?.name || ''}...` : 'Select a participant...'}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onInput={handleTyping}
              disabled={chatMode === 'private' && !dmTarget}
            />
            <button type="button" className="text-2xl px-2 flex-shrink-0" onClick={() => setShowEmojiPicker(v => !v)} title="Add emoji">😊</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-semibold disabled:opacity-50 flex-shrink-0 whitespace-nowrap" disabled={!chatInput.trim() && !uploading || (chatMode === 'private' && !dmTarget)}>Send</button>
            {/* Emoji picker popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-14 right-0 z-50">
                <Suspense fallback={<div>Loading...</div>}>
                  <Picker onEmojiSelect={e => { setChatInput(chatInput + e.native); setShowEmojiPicker(false); }} theme="light" />
                </Suspense>
              </div>
            )}
          </form>
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="px-4 pb-2 text-xs text-gray-500">{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</div>
          )}
        </div>
      )}
    </div>
  )
}

function ToolbarButton({ icon, label, onClick, red = false, active = false, unread = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <button
        type="button"
        onClick={onClick}
        className={`
          flex items-center justify-center
          w-12 h-12 md:w-14 md:h-14
          rounded-full
          shadow-xl
          transition-all duration-200
          border-2
          focus:outline-none
          focus:ring-2 focus:ring-primary/40
          ${red ? 'bg-red-600 hover:bg-red-700 text-white border-red-700' : active ? 'bg-primary/90 text-white border-primary' : 'bg-white hover:bg-gray-100 text-black border-gray-200'}
        `}
      >
        <span className="text-xl md:text-2xl flex items-center justify-center">
          {icon}
        </span>
        {unread > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-bold animate-pulse">{unread}</span>
        )}
      </button>
      <span className="text-xs mt-1 text-black/80 whitespace-nowrap font-medium tracking-wide">{label}</span>
    </div>
  )
}
