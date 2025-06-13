'use client'

import { Button } from '@/components/ui/button'

interface Props {
  meetingId: string
}

export default function MeetingLinkBox({ meetingId }: Props) {
  const fullLink = `${window.location.origin}/meeting/${meetingId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink)
    alert("Link copied!")
  }

  return (
    <div className="bg-white text-black rounded-xl p-6 shadow w-96 text-center space-y-4">
      <h3 className="font-semibold">Your meeting has started</h3>
      <div className="flex items-center justify-center space-x-2">
        <div className="bg-gray-100 px-3 py-2 rounded text-sm truncate">
          {fullLink}
        </div>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          Copy
        </Button>
      </div>
      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
        Add more people
      </Button>
      <p className="text-xs text-gray-500">People you share this link with can join automatically</p>
    </div>
  )
}
