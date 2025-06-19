'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function JoinMeetingPage() {
  const [meetingId, setMeetingId] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const router = useRouter()

  const handleJoin = (e) => {
    e.preventDefault()
    if (!meetingId || !name) return
    if (remember) {
      localStorage.setItem('general_settings_v1', JSON.stringify({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' '), avatar: undefined }))
    }
    // Always save name for this session
    sessionStorage.setItem('meetio_temp_name', name)
    router.push(`/meetings/${meetingId}`)
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navbar */}
      <header className="w-full px-10 py-4 bg-white shadow flex justify-between items-center border-b">
        <div className="text-2xl font-bold text-teal-600">Meetio</div>
        <div className="flex gap-4">
          <button className="text-sm border border-gray-300 rounded-full px-5 py-1 text-gray-600 hover:bg-gray-100">
            Support
          </button>
          <button className="text-sm bg-teal-500 text-white rounded-full px-5 py-1 hover:bg-teal-600">
            Sign Up Free
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center py-10">
        <div className="flex bg-white shadow-md rounded-md overflow-hidden">
          {/* Left form side */}
          <div className="w-[440px] px-10 py-12 flex flex-col items-center justify-center bg-white">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Join a meeting</h2>
            <p className="text-gray-500 mb-6">Enter meeting details to continue</p>

            <div className="text-[64px] mb-6">📹</div>

            <form onSubmit={handleJoin} className="w-full">
              <input
                type="text"
                placeholder="Enter meeting ID..."
                className="w-full border border-gray-300 rounded px-4 py-3 mb-4 text-sm"
                value={meetingId}
                onChange={e => setMeetingId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded px-4 py-3 mb-4 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <label className="flex items-center mb-4 text-sm text-gray-600">
                <input type="checkbox" className="mr-2" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember my name for future meetings
              </label>

              <div className="flex w-full gap-4 mb-4">
                <button
                  type="submit"
                  className={`flex-1 bg-blue-500 text-white py-3 rounded text-sm transition ${(!meetingId || !name) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  disabled={!meetingId || !name}
                >
                  Join
                </button>
                <button type="button" className="flex-1 border border-gray-300 py-3 rounded text-sm" onClick={() => router.push('/')}>Cancel</button>
              </div>
            </form>

            <p className="text-xs text-center text-gray-400">
              By clicking "Join" you agree to our{' '}
              <a href="#" className="text-blue-500 underline">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-500 underline">Privacy Policy</a>
            </p>
          </div>

          {/* Right image side */}
          <div className="w-[440px] h-full">
            <Image
              src="/join-meeting-illustration.png"
              alt="Meeting illustration"
              width={440}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
