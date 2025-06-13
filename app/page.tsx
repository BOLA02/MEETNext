"use client"

import { useState } from "react"
import { Video, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from 'next/link'




export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()

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

//   const handleStartInstantMeeting = () => {
//   const meetingId = nanoid(10)  
//   router.push(`/meeting/${meetingId}`)
// }


  if (isSignedIn) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto">
        {/* Link Icon */}
        <div className="mb-8">
          <div className="bg-purple-500 text-white p-3 rounded-full">
            <Link2 className="h-6 w-6" onClick={handleStartInstantMeeting}/>
          </div>
        </div>

        {/* Illustration */}
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
            className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Video className="h-5 w-5" />
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
