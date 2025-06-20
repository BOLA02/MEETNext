"use client"

import { useState, useEffect } from "react"
import { Video, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { toast } from "sonner"

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, router])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const handleSignIn = () => {
    setIsSignedIn(true)
    router.push("/dashboard")
  }


  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10)
    return `${window.location.origin}/meeting/${randomId}`
  }

  const handleStartInstantMeeting = () => {
  const meetingId = Math.random().toString(36).substring(2, 10)
  router.push(`/meetings/${meetingId}`)
}

const handleCopyLink = () => {
  const meetingId = Math.random().toString(36).substring(2, 10)
  const meetingLink = `${window.location.origin}/meetings/${meetingId}`
  navigator.clipboard.writeText(meetingLink)
    .then(() => {
      toast.success("Meeting link copied to clipboard!", {
        style: {
          backgroundColor: '#7e22ce', // purple-600
          color: '#fff'
        }
      })
    })
    .catch(() => toast.error("Failed to copy the meeting link."))

  // Immediately redirect after copying
  router.push(`/meetings/${meetingId}`)
}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-purple-500">Meet</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            {currentDate} • {currentTime}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-purple-500 border-purple-500">
              Support
            </Button>
            <Button onClick={handleSignIn} className="bg-purple-500 hover:bg-purple-600 text-white">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto">
        {/* Copy link button */}
        <div className="mb-8">
          <button
            onClick={handleCopyLink}
            className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition"
            title="Copy meeting link"
          >
            <Link2 className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8 flex justify-center">
          <img
            src="/people.png"
            alt="People working together"
            className="w-80 h-48 object-cover rounded-lg"
          />
        </div>

        <p className="text-gray-600 text-center mb-8 max-w-md">
          Copy and share meeting link with other people to join your meeting
        </p>

        <div className="w-full max-w-md space-y-4 mb-6">
          <Link href="/join-meeting" passHref>
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-full"
              size="lg"
            >
              Join a Meeting
            </Button>
          </Link>

          <Button
            onClick={handleStartInstantMeeting}
            className="w-full bg-black hover:bg-gray-900 text-white py-6 text-lg font-semibold rounded-full flex items-center justify-center gap-3 shadow-md transition"
            size="lg"
          >
            <Video className="h-6 w-6 mr-2" />
            Start an instant meeting
          </Button>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Input
            placeholder="Enter meeting code or link"
            className="py-6 text-center rounded-full border-2 border-gray-200 focus:border-purple-500"
          />
          <div className="flex justify-center">
            <Button
              className="bg-purple-300 hover:bg-purple-400 text-purple-800 px-8 py-3 rounded-full"
              variant="secondary"
            >
              Join
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-500 border-t bg-white mt-auto">
        © 2025 Meet Meetings. All rights reserved.{" "}
        <a href="#" className="text-purple-500 hover:underline">
          Privacy Policy
        </a>{" "}
        &{" "}
        <a href="#" className="text-purple-500 hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  )
}
