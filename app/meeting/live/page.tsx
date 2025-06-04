"use client"

import { useState, useEffect } from "react"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
  Settings,
  Users,
  MessageSquare,
  MoreHorizontal,
  Copy,
  X,
  Send,
  Smile,
  ChevronDown,
  Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export default function LiveMeeting() {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(true)
  const [showRecordingRequest, setShowRecordingRequest] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentUser, setCurrentUser] = useState({
    name: "You",
    avatar: "Y",
    hasJoined: false,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  // Get meeting title from URL params or use default
  const meetingTitle = searchParams.get("title") || "Meetio Designers Meeting"
  const hostName = searchParams.get("host") || "Pelvin Olusegun"

  const meetingLink = "meetio.com/gyh-huy-hij"

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAllowPermissions = () => {
    setShowPermissionDialog(false)
    setIsMuted(false)
    setIsVideoOn(true)
    setCurrentUser((prev) => ({ ...prev, hasJoined: true }))
  }

  const handleContinueWithoutPermissions = () => {
    setShowPermissionDialog(false)
    setCurrentUser((prev) => ({ ...prev, hasJoined: true }))
  }

  const handleAllowRecording = () => {
    setShowRecordingRequest(false)
    setIsRecording(true)
  }

  const handleDenyRecording = () => {
    setShowRecordingRequest(false)
  }

  const handleLeaveMeeting = () => {
    router.push("/dashboard")
  }

  const handleRequestRecording = () => {
    setShowRecordingRequest(true)
  }

  // Base participants (already in the meeting)
  const baseParticipants = [
    { name: "Kamaldeen Iddrisu", avatar: "K", color: "bg-blue-500", hasVideo: true },
    { name: "Sarah Johnson", avatar: "S", color: "bg-green-500", hasVideo: true },
    { name: "Mike Chen", avatar: "M", color: "bg-purple-500", hasVideo: true },
    { name: "Emily Davis", avatar: "E", color: "bg-orange-500", hasVideo: true },
    { name: "Alex Rodriguez", avatar: "A", color: "bg-red-500", hasVideo: true },
    { name: "Lisa Wang", avatar: "L", color: "bg-pink-500", hasVideo: true },
    { name: "David Kim", avatar: "D", color: "bg-yellow-500", hasVideo: true },
    { name: "Rachel Green", avatar: "R", color: "bg-indigo-500", hasVideo: true },
    { name: "Felix Opoku Ameyaw", avatar: "FO", color: "bg-gray-400", hasVideo: false },
    { name: "James Wilson", avatar: "J", color: "bg-gray-400", hasVideo: false },
    { name: "Chantel Annan", avatar: "C", color: "bg-emerald-500", hasVideo: true },
  ]

  // Add current user only if they have joined
  const participants = currentUser.hasJoined
    ? [
        ...baseParticipants,
        {
          name: "You",
          avatar: "Y",
          color: "bg-teal-500",
          hasVideo: isVideoOn,
          isYou: true,
        },
      ]
    : baseParticipants

  const chatMessages = [
    {
      user: "Kamaldeen Iddrisu",
      message: "Welcome to the meeting everyone!",
      time: "Now",
      avatar: "K",
      color: "bg-blue-500",
    },
    { user: "Felix Opoku Ameyaw", message: "Thank you 🙏", time: "Now", avatar: "F", color: "bg-blue-500" },
    { user: "Sarah Johnson", message: "Great to be here!", time: "Now", avatar: "S", color: "bg-green-500" },
    { user: "Chantel Annan", message: "Thank you", time: "Now", avatar: "C", color: "bg-emerald-500" },
    { user: "Mike Chen", message: "Looking forward to this", time: "16:32", avatar: "M", color: "bg-purple-500" },
    { user: "Emily Davis", message: "Thank you 🙏", time: "16:33", avatar: "E", color: "bg-orange-500" },
    { user: "Alex Rodriguez", message: "What's the agenda today?", time: "12:35", avatar: "A", color: "bg-red-500" },
    { user: "Lisa Wang", message: "Let's goooo", time: "Now", avatar: "L", color: "bg-pink-500" },
    {
      user: "David Kim",
      message: "We're excited to get started 😊",
      time: "Now",
      avatar: "D",
      color: "bg-yellow-500",
    },
  ]

  if (showPermissionDialog) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">Y</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2 text-white">You</h2>
          </div>

          <div className="bg-white text-gray-900 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-medium mb-2">Grant microphone and camera access or continue without it?</h3>
            <p className="text-sm text-gray-600 mb-4">You can change this setting later in the meeting</p>
            <div className="space-y-3">
              <Button onClick={handleAllowPermissions} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Allow microphone and camera access
              </Button>
              <Button onClick={handleContinueWithoutPermissions} variant="ghost" className="w-full text-teal-600">
                Continue without microphone and camera
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant={!isVideoOn ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button variant="secondary" size="icon" className="rounded-full">
              <Monitor className="h-5 w-5" />
            </Button>

            <Button variant="destructive" size="icon" className="rounded-full" onClick={handleLeaveMeeting}>
              <Phone className="h-5 w-5" />
            </Button>

            <Button variant="secondary" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="secondary" size="icon" className="rounded-full">
              <Users className="h-5 w-5" />
            </Button>

            <Button variant="secondary" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button variant="secondary" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-xs text-gray-400">January, 20 2025 • 12:30 PM</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-medium">{meetingTitle}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs">{hostName.charAt(0)}</span>
            </div>
            <span>Host: {hostName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {participants.slice(0, 4).map((participant, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 border-gray-800 ${participant.color} flex items-center justify-center text-xs font-medium`}
                >
                  {participant.avatar}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-300">{participants.length} participants</span>
            <ChevronDown className="h-4 w-4 text-gray-300" />
          </div>
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded">
            <span className="text-sm">{meetingLink}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">{formatTime(recordingTime)}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Pause className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Recording Notification */}
      {isRecording && (
        <div className="bg-red-600 text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Kamaldeen is recording this meeting</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={`${showChat ? "flex-1" : "w-full"} p-4`}>
          <div className="grid grid-cols-4 gap-4 h-full">
            {participants.map((participant, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden relative">
                {participant.hasVideo ? (
                  <div className={`w-full h-full ${participant.color} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-black bg-opacity-20 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{participant.avatar}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{participant.avatar}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                  {participant.name}
                </div>
                <div className="absolute top-2 right-2">
                  {participant.isYou && !isMuted && (
                    <div className="bg-teal-500 p-1 rounded">
                      <Mic className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {participant.isYou && isMuted && (
                    <div className="bg-red-500 p-1 rounded">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {!participant.hasVideo && !participant.isYou && (
                    <div className="bg-gray-600 p-1 rounded">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-96 bg-white text-gray-900 border-l">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Chat</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 text-xs text-gray-500 border-b">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>You can pin chats to make them more visible for everyone in the meeting</span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-96">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-white text-xs font-medium`}
                  >
                    {msg.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">• {msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">Direct message</span>
                <select className="text-xs bg-teal-600 text-white px-2 py-1 rounded">
                  <option>Everyone</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type message here..."
                  className="flex-1"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">Mute</span>
          </Button>

          <Button
            variant={!isVideoOn ? "destructive" : "secondary"}
            size="icon"
            className="rounded-full"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            <span className="sr-only">Stop video</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <Monitor className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <Users className="h-5 w-5" />
            <span className="sr-only">Raise hand</span>
          </Button>

          <Button variant="destructive" size="icon" className="rounded-full" onClick={handleLeaveMeeting}>
            <Phone className="h-5 w-5" />
            <span className="sr-only">Leave call</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full" onClick={handleRequestRecording}>
            <Video className="h-5 w-5" />
            <span className="sr-only">Request Recording</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <Smile className="h-5 w-5" />
            <span className="sr-only">Stickers</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Captions</span>
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full" onClick={() => setShowChat(!showChat)}>
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Chat</span>
          </Button>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-400">January, 20 2025 • 12:30 PM</span>
        </div>
      </div>

      {/* Recording Request Dialog */}
      {showRecordingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md mx-4">
            <h3 className="font-medium mb-4">Kamaldeen is requesting to record this meeting</h3>
            <div className="flex gap-3">
              <Button onClick={handleAllowRecording} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                Allow
              </Button>
              <Button onClick={handleDenyRecording} variant="destructive" className="flex-1">
                Deny
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
