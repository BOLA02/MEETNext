"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function InstantMeeting() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const router = useRouter()

  const handleJoinMeeting = () => {
    setShowPreview(false)
  }

  const handleLeaveMeeting = () => {
    router.push("/dashboard")
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <header className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium">Instant meeting - Mic & video confirmation</h1>
            <div className="text-sm text-gray-400">Faris Oyelola Amjeeuw</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* User Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <div className="w-20 h-20 bg-red-700 rounded-full"></div>
              </div>
            </div>

            <h2 className="text-xl font-medium mb-2">Faris Oyelola</h2>

            {/* Preview Card */}
            <div className="bg-white text-gray-900 rounded-lg p-6 mb-6">
              <h3 className="font-medium mb-2">
                Grant microphone and camera access or continue without microphone and camera
              </h3>
              <p className="text-sm text-gray-600 mb-4">You can change this setting in the meeting.</p>
              <Button onClick={handleJoinMeeting} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                Continue
              </Button>
            </div>

            <p className="text-xs text-gray-400">Continue without microphone and camera</p>
          </div>
        </main>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-4">
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

            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
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
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-xs text-gray-400">Thursday 10:21:00 - 10:21:00 PM</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Instant meeting</h1>
          <div className="text-sm text-gray-400">Meet Link</div>
        </div>
      </header>

      {/* Main Meeting Area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          {/* User Video */}
          <div className="w-64 h-48 mx-auto mb-6 rounded-lg overflow-hidden bg-gray-800 relative">
            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-700 rounded-full"></div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              Faris Oyelola
            </div>
          </div>

          {/* Meeting Info */}
          <div className="bg-white text-gray-900 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Your meeting has started</h3>
            <p className="text-sm text-gray-600">Share your screen or invite others to join.</p>
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4">
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

          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
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
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">Thursday 10:21:00 - 10:21:00 PM</p>
      </div>
    </div>
  )
}
