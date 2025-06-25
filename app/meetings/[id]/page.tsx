'use client'

import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, Video, VideoOff, Settings, Copy, UserPlus, PhoneOff, Hand, Smile, Captions, MoreHorizontal, Share2, MessageCircle, Paperclip, SmilePlus, Pin, Loader2, X, Bell, Sun, Moon, Users, SlidersHorizontal, CheckCircle, Info, Speaker, Monitor, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Volume2, Separator } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'

// Lazy load the heavy emoji picker component
const Picker = lazy(() => import('@emoji-mart/react'))

// Remove mock participants, only show self
const otherParticipants = []

type Participant = {
  id: string;
  name: string;
  avatar: string;
  isMe: boolean;
  mic: boolean;
  video: boolean;
  isHost?: boolean;
  handRaised?: boolean;
};

export default function MeetingPage() {
  console.log({ Tabs, TabsList, TabsTrigger, TabsContent, Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Switch });
  const { id } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [videoOn, setVideoOn] = useState(true)
  const [user, setUser] = useState<Participant | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
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
  const [reactions, setReactions] = useState<Record<string, string>>({})
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
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [chatPrivacy, setChatPrivacy] = useState<'public' | 'private'>('public')
  const [videoQuality, setVideoQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto')
  const [noiseSuppression, setNoiseSuppression] = useState(true)
  const [echoCancellation, setEchoCancellation] = useState(true)
  const [soundNotifications, setSoundNotifications] = useState(true)
  const [popupNotifications, setPopupNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [showNames, setShowNames] = useState(true)
  const [settingsTab, setSettingsTab] = useState<'audio' | 'video' | 'general'>('audio')
  const [micDevice, setMicDevice] = useState('Default Microphone')
  const [speakerDevice, setSpeakerDevice] = useState('Default Speaker')
  const [noiseSuppressionLevel, setNoiseSuppressionLevel] = useState('medium')
  const [pushToTalk, setPushToTalk] = useState(false)
  const [videoDevice, setVideoDevice] = useState('Default Camera')
  const [backgroundBlur, setBackgroundBlur] = useState(false)
  const [appearance, setAppearance] = useState<'system' | 'light' | 'dark'>('system')
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Memoized user initialization function
  const initializeUser = useCallback(() => {
    const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}')
    let name: string = settings.firstName && settings.lastName ? `${settings.firstName} ${settings.lastName}` : ''
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
    function getInitialsAvatar(name: string): string {
      if (!name) return '/avatar-demo.jpg'
      const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      // Use a simple SVG for initials
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=232323&color=fff&size=128&rounded=true`
    }
    const me: Participant = {
      id: myId,
      name: name || 'You',
      avatar: settings.avatar || getInitialsAvatar(name),
      isMe: true,
      mic: micOn,
      video: videoOn,
    }
    setUser(me)
    // Add self to participants list immediately
    setParticipants([{ ...me, isHost: true }])
  }, [micOn, videoOn])

  // Load user from localStorage/sessionStorage on client only
  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  // Memoized socket event handlers
  const handleParticipants = useCallback((list: Participant[]) => {
    setParticipants((prev: Participant[]) => {
      const me = prev.find((p) => p.isMe)
      const others = list.filter((p) => p.id !== me?.id)
      return [me, ...others].filter(Boolean) as Participant[]
    })
  }, [user?.id])

  const handleReaction = useCallback(({ userId, emoji }: { userId: string; emoji: string }) => {
    setReactions((prev: Record<string, string>) => ({ ...prev, [userId]: emoji }))
    if (userId === user?.id) {
      setSelectedSticker(emoji)
      setTimeout(() => setSelectedSticker(null), 2000)
    }
    setTimeout(() => setReactions((prev: Record<string, string>) => {
      const copy = { ...prev }; delete copy[userId]; return copy;
    }), 2000)
  }, [user?.id])

  const handleStateUpdate = useCallback(({ userId, mic, video }: { userId: string; mic: boolean; video: boolean }) => {
    setParticipants((prev: Participant[]) => prev.map((p: Participant) => p.id === userId ? { ...p, mic, video } : p))
  }, [])

  const handleChatMessage = useCallback((msg: any) => {
    setMessages((prev: any[]) => [...prev, msg])
    // Unread badge logic
    if (!showChat) setUnreadCount((c: number) => c + 1)
  }, [showChat])

  // Socket.IO: join room and sync participants
  useEffect(() => {
    if (!user || !id) return
    // Connect only once
    if (!socketRef.current) {
      socketRef.current = io('ws://localhost:5000')
    }
    const socket = socketRef.current
    if (!socket) return
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
        const filtered = arr.filter((r: any) => r.userId !== userId)
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
    socket.on('typing', ({ userId, name }: { userId: string; name: string }) => {
      if (userId === user?.id) return
      setTypingUsers((prev: string[]) => Array.from(new Set([...prev, name])))
      setTimeout(() => setTypingUsers((prev: string[]) => prev.filter((n: string) => n !== name)), 2000)
    })
    socket.on('online-users', (ids: string[]) => {
      setOnlineUserIds(ids)
    })
    socket.on('read-receipt', ({ messageId, userIds }: { messageId: string; userIds: string[] }) => {
      setReadReceipts((prev: Record<string, string[]>) => ({ ...prev, [messageId]: userIds }))
    })
    return () => {
      if (socket) {
        socket.emit('leave-room', { roomId: id })
        socket.disconnect()
      }
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
    if (videoOn) {
      setVideoLoading(true)
      setVideoError(null)
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          setLocalStream(s);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
          setVideoLoading(false)
        })
        .catch(err => {
          setVideoError('Unable to access camera. Please check your permissions.');
          setVideoLoading(false)
        })
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setVideoLoading(false)
      setVideoError(null)
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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
  // Google Meet style emoji stickers 
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

  function renderParticipant(participant: Participant, index: number, total: number) {
    const isMe = participant.isMe
    const videoRef = isMe ? localVideoRef : null // TODO: remote refs
    const reaction = reactions[participant.id]
    const isActuallyVideoOn = isMe ? videoOn : participant.video
    const isActuallyMicOn = isMe ? micOn : participant.mic
    const isHandRaised = isMe ? handRaised : participant.handRaised

    // Responsive grid sizing
    let sizeClasses = "w-full flex justify-center items-center p-2"
    let aspect = "aspect-video"
    let maxW = "max-w-[90vw] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px]"
    let maxH = "max-h-[40vw] sm:max-h-[260px] md:max-h-[340px] lg:max-h-[400px]"
    if (total === 1) {
      maxW = "max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px]"
      maxH = "max-h-[50vw] sm:max-h-[340px] md:max-h-[420px] lg:max-h-[500px]"
    }

    // Glassmorphic tile with glow for hand raised
    const tileClasses = `relative flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-zinc-800/80 backdrop-blur-md shadow-xl border-2 transition-all duration-300
      ${isHandRaised ? 'border-yellow-400 shadow-yellow-400/40 animate-pulse' : 'border-zinc-700'}
      ${aspect} ${maxW} ${maxH} w-full`

    return (
      <div key={participant.id} className={sizeClasses}>
        <div className={tileClasses}>
          <div className="absolute top-2 right-2 z-10">
            {isHandRaised && (
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow animate-bounce">✋ Raised</span>
            )}
          </div>
          <div className="w-full h-full flex items-center justify-center">
            {isMe ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover rounded-2xl transition-all duration-300 ${!videoOn ? 'hidden' : ''}`} onLoadedData={() => setVideoLoading(false)} />
                {videoLoading && videoOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20">
                    <Loader2 className="animate-spin w-10 h-10 text-white mb-2" />
                    <span className="text-white text-xs">Loading camera...</span>
                  </div>
                )}
                {videoError && videoOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                    <span className="text-red-400 text-sm font-semibold mb-2">{videoError}</span>
                  </div>
                )}
              </>
            ) : isActuallyVideoOn ? (
              <video autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl transition-all duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <img src={participant.avatar} alt={participant.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 shadow-lg" />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900/80 text-white text-xs sm:text-sm px-3 py-1 rounded-full flex items-center gap-2 shadow transition-all duration-300">
            {isActuallyMicOn ? <Mic size={14} /> : <MicOff size={14} className="text-red-400"/>}
            <span className="font-semibold">{participant.name}{isMe && ' (You)'}</span>
          </div>
          {reaction && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">{reaction}</div>}
        </div>
      </div>
    )
  }

  // Responsive grid container
  const gridClasses = `w-full flex flex-wrap justify-center items-center gap-2 md:gap-4 pt-4 pb-32 md:pb-40 transition-all duration-300`

  const handleShareScreen = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        setIsScreenSharing(true)
        setLocalStream(screenStream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        toast.success('Screen sharing started')
        // Listen for when the user stops sharing
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          // Revert to camera
          navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((camStream) => {
              setLocalStream(camStream)
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = camStream
              }
              toast.info('Screen sharing stopped')
            })
        }
      } catch (err) {
        toast.error('Screen sharing cancelled or failed')
      }
    } else {
      // Stop screen sharing
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      setIsScreenSharing(false)
      // Revert to camera
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((camStream) => {
          setLocalStream(camStream)
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = camStream
          }
          toast.info('Screen sharing stopped')
        })
    }
  }, [isScreenSharing, localStream])

  if (!user) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-[#232323]"><div className="w-10 h-10 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Date/Time outside call area - top left */}
      <div className="absolute top-6 left-6 text-white text-sm opacity-80 select-none z-30">
        {dateStr} • {timeStr}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-6 top-6 bottom-6 w-80 bg-[#2d1846] rounded-2xl shadow-2xl border border-purple-900 z-40 flex flex-col">
          <div className="p-4 border-b border-purple-800">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <button onClick={() => setShowChat(false)} className="text-white hover:text-purple-300">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-purple-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <img src={msg.userAvatar} alt={msg.userName} className="w-6 h-6 rounded-full" />
                  <span className="text-white text-sm font-medium">{msg.userName}</span>
                  <span className="text-purple-300 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-white text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-purple-800">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-purple-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stickers Panel */}
      {showStickers && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-[#2d1846] rounded-2xl p-4 shadow-2xl border border-purple-900 z-40">
          <div className="grid grid-cols-3 gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => handleSelectSticker(sticker)}
                className="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-purple-700"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Captions Panel */}
      {captionsOn && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-40">
          Captions: "Hello, this is a test caption..."
        </div>
      )}

      {/* Main Meeting Area */}
      <div className="relative w-full max-w-5xl aspect-video bg-gradient-to-br from-purple-700 via-purple-500 to-purple-400 rounded-3xl shadow-2xl flex flex-col items-center justify-center overflow-hidden border-4 border-black mx-2 mt-8">
        {/* Top right more button */}
        <button className="absolute top-6 right-8 bg-white/80 rounded-full p-3 shadow-lg text-purple-700 hover:bg-white z-20">
          <MoreHorizontal size={28} />
        </button>
        
        {/* Video Stream or Avatar */}
        <div className="flex flex-col items-center justify-center h-full w-full relative">
          {(videoOn || isScreenSharing) ? (
            <>
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-2xl transition-all duration-300" 
                onLoadedData={() => setVideoLoading(false)} 
              />
              {videoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20">
                  <Loader2 className="animate-spin w-10 h-10 text-white mb-2" />
                  <span className="text-white text-xs">Loading camera...</span>
                </div>
              )}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                  <span className="text-red-400 text-sm font-semibold mb-2">{videoError}</span>
                </div>
              )}
              {isScreenSharing && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-30">
                  🔴 LIVE
                </div>
              )}
            </>
          ) : (
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4" />
          )}
        </div>
        
        {/* Name bottom left */}
        <div className="absolute left-6 bottom-6 text-white text-lg font-semibold drop-shadow-lg z-30">{user.name}</div>
        
        {/* Info/Chat absolutely bottom right */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-4 items-end justify-end z-20">
          <button className="bg-[#2d1846] text-white rounded-full p-4 shadow-lg mb-2 hover:bg-purple-700"><Info size={22} /></button>
          <button 
            onClick={() => setShowChat(!showChat)} 
            className="bg-[#2d1846] text-white rounded-full p-4 shadow-lg hover:bg-purple-700"
          >
            <MessageCircle size={22} />
          </button>
        </div>
      </div>
      {/* Toolbar and bottom controls */}
      <div className="w-full max-w-3xl flex flex-row items-end justify-center mt-8 px-4">
        {/* Toolbar */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 bg-[#2d1846] bg-opacity-95 rounded-full px-8 py-4 shadow-2xl border border-purple-900">
            <ToolbarButton icon={micOn ? <Mic size={22} /> : <MicOff size={22} />} label={micOn ? "Mute" : "Unmute"} onClick={handleToggleMic} active={micOn} />
            <ToolbarButton icon={videoOn ? <Video size={22} /> : <VideoOff size={22} />} label={videoOn ? "Stop video" : "Start video"} onClick={handleToggleVideo} active={videoOn} />
            <ToolbarButton icon={<Monitor size={22} />} label="Share" onClick={handleShareScreen} active={isScreenSharing} />
            <ToolbarButton icon={<Hand size={22} />} label="Raise hand" onClick={handleRaiseHand} active={handRaised} />
            <ToolbarButton icon={<PhoneOff size={22} />} label="Leave call" red onClick={handleLeave} />
            <ToolbarButton icon={<Smile size={22} />} label="Stickers" onClick={handleStickers} active={showStickers} />
            <ToolbarButton icon={<Captions size={22} />} label="Captions" purple onClick={handleCaptions} active={captionsOn} />
            <ToolbarButton icon={<MoreHorizontal size={22} />} label="More" onClick={handleMore} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({ icon, label, red = false, purple = false, onClick, active = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={onClick}
        className={`rounded-full w-14 h-14 flex items-center justify-center text-xl shadow-md transition-all duration-200
          ${red ? 'bg-red-600 hover:bg-red-700 text-white' : purple ? 'bg-purple-600 hover:bg-purple-700 text-white' : active ? 'bg-white text-purple-700 ring-2 ring-purple-400' : 'bg-white hover:bg-gray-100 text-black'}`}
      >
        {icon}
      </button>
      <span className={`text-xs mt-1 font-medium ${red ? 'text-red-500' : purple ? 'text-purple-400' : active ? 'text-purple-400' : 'text-white'}`}>{label}</span>
    </div>
  )
}
 