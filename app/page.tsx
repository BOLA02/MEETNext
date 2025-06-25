"use client"

import { useState, useMemo, useEffect } from "react"
import { Video, Keyboard, X, Link as LinkIcon, PlusCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { toast } from "sonner"
import AnimatedMeetingGraphic from "@/components/ui/AnimatedMeetingGraphic"

const NewMeetingModal = ({ isOpen, onClose, onStartMeeting, onCopyLink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl transform transition-all animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <button
            onClick={onStartMeeting}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700"
          >
            <PlusCircle size={28} />
            <div>
              <h3 className="font-semibold text-left">Start an instant meeting</h3>
              <p className="text-sm text-gray-600 text-left">Jump right into a new meeting</p>
            </div>
          </button>
          <button
            onClick={onCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
          >
            <LinkIcon size={28} />
            <div>
              <h3 className="font-semibold text-left">Get a link to share</h3>
              <p className="text-sm text-gray-600 text-left">Create a link and send it to participants</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InstantMeetingPage() {
  const [meetingCode, setMeetingCode] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const [time, setTime] = useState({
    currentDate: "",
    currentTime: "",
  });

  useEffect(() => {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    setTime({
      currentTime: timeFormatter.format(now),
      currentDate: dateFormatter.format(now),
    });
  }, []);

  const handleNewMeetingClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setIsModalOpen(true);
    }, 1000); // Match animation duration
  };

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
          description: meetingLink,
          action: {
            label: "Join",
            onClick: () => router.push(`/meetings/${meetingId}`),
          },
        });
      })
      .catch(() => toast.error("Failed to copy the meeting link."))
    setIsModalOpen(false)
  }

  const handleJoinMeeting = (e) => {
    e.preventDefault()
    if (meetingCode.trim()) {
      // Basic validation for a meeting code/link
      const meetingId = meetingCode.split('/').pop()
      router.push(`/meetings/${meetingId}`)
    } else {
      toast.error("Please enter a meeting code or link.")
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(1440deg); }
          }
          .spinning {
            animation: spin 1s ease-out;
          }
        `}
      </style>
      {/* Left Pane */}
      <div className="flex flex-1 flex-col justify-between p-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Meetio
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{time.currentDate}</span>
            <span>{time.currentTime}</span>
          </div>
        </header>

        <main className="flex flex-col items-start max-w-lg mx-auto w-full">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-4">
            Premium video meetings.
            <br />
            Now free for everyone.
          </h1>
          <p className="text-gray-600 mb-8">
            We re-engineered the service we built for secure business meetings,
            Meetio, to make it free and available for all.
          </p>

          <div className="flex items-center gap-4 w-full">
            <Button
              onClick={handleNewMeetingClick}
              className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-base rounded-md flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg ${isSpinning ? 'spinning' : ''}`}
              disabled={isSpinning}
            >
              <Video className="h-5 w-5" />
              <span>New meeting</span>
            </Button>
            
            <form onSubmit={handleJoinMeeting} className="flex-1 flex items-center">
              <div className="relative flex-1">
                <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  placeholder="Enter a code or link"
                  className="pl-10 pr-4 py-6 border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <Button
                type="submit"
                variant="ghost"
                className="text-gray-600 hover:text-purple-600 ml-2"
                disabled={!meetingCode.trim()}
              >
                Join
              </Button>
            </form>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-4 w-full">
            <Link href="/about" className="text-gray-500 hover:text-gray-800">
              Learn more
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link href="/help" className="text-gray-500 hover:text-gray-800">
              Help
            </Link>
          </div>
        </main>
        
        <footer className="text-xs text-gray-400">
          © {new Date().getFullYear()} Meetio
        </footer>
      </div>

      {/* Right Pane */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gray-50 rounded-l-3xl">
        <div className="relative w-full max-w-md">
          <div className="aspect-w-1 aspect-h-1">
            <AnimatedMeetingGraphic />
          </div>
          <div className="mt-8 text-center">
             <h2 className="text-2xl font-semibold text-gray-800">Get a link you can share</h2>
             <p className="text-gray-600 mt-2">Click <span className="font-semibold">New meeting</span> to get a link you can send to people you want to meet with.</p>
          </div>
        </div>
      </div>
      <NewMeetingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartMeeting={handleStartInstantMeeting}
        onCopyLink={handleCopyLink}
      />
    </div>
  )
}
