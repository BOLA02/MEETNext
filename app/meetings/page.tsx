import Link from 'next/link'

export default function MeetingsDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-4">Meetings Dashboard</h1>
      <p className="text-gray-600 mb-8">View and manage your meetings here.</p>
      <Link href="/dashboard/meetings" className="text-blue-600 hover:underline">Go to detailed meetings dashboard</Link>
    </div>
  )
} 