"use client"

import { useState } from "react"
import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("")
  const [name, setName] = useState("")
  const [rememberName, setRememberName] = useState(false)
  const router = useRouter()

  const handleJoin = () => {
    if (meetingId && name) {
      router.push("/meeting/room")
    }
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join a meeting</h1>
            <p className="text-gray-600">Enter meeting details to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting ID</label>
              <Input
                placeholder="Enter meeting ID..."
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberName} onCheckedChange={setRememberName} />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember my name for future meetings
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleJoin}
                disabled={!meetingId || !name}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-full py-3"
              >
                Join
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1 rounded-full py-3">
                Cancel
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By clicking "Join" you agree to our{" "}
              <a href="#" className="text-purple-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-500 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="w-1/2 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center p-8">
        <div className="relative">
          {/* Circular meeting table illustration */}
          <div className="w-80 h-80 relative">
            {/* Table */}
            <div className="absolute inset-8 bg-purple-300 rounded-full"></div>

            {/* People around the table */}
            {[...Array(8)].map((_, i) => {
              const angle = i * 45 * (Math.PI / 180)
              const radius = 140
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={i}
                  className="absolute w-12 h-12 rounded-full"
                  style={{
                    left: `calc(50% + ${x}px - 24px)`,
                    top: `calc(50% + ${y}px - 24px)`,
                    backgroundColor: [
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#22c55e",
                      "#06b6d4",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                    ][i],
                  }}
                >
                  <div className="w-8 h-8 bg-black bg-opacity-20 rounded-full m-2"></div>
                </div>
              )
            })}

            {/* Documents and items on table */}
            <div className="absolute inset-16 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-4 rounded"
                    style={{
                      backgroundColor: [
                        "#fbbf24",
                        "#34d399",
                        "#60a5fa",
                        "#a78bfa",
                        "#f472b6",
                        "#fb7185",
                        "#fbbf24",
                        "#34d399",
                        "#60a5fa",
                      ][i],
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
