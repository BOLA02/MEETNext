'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

export default function CreateMeeting() {
  const router = useRouter()

  const handleCreateMeeting = () => {
    const meetingId = uuid()
    const link = `${window.location.origin}/meeting/${meetingId}`
    navigator.clipboard.writeText(link)
    toast.success("Meeting link copied!", {
      description: link,
      style: { backgroundColor: "#7e22ce", color: "white" },
    })
    router.push(`/meeting/${meetingId}`)
  }

  return (
    <button onClick={handleCreateMeeting} className="bg-purple-600 text-white p-4 rounded-lg">
      Create Meeting
    </button>
  )
}
