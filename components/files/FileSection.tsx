'use client'

import { SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import FileTopbar from './FileTopbar'
import MeetingNotesPanel from './MeetingNotesPanel'
import {
  FilePlus,
  Table,
  ClipboardList,
  LayoutTemplate,
  UploadCloud
} from 'lucide-react'

export default function FileSection() {
  const [activeTab, setActiveTab] = useState('My Files')
    const router = useRouter()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'My Files':
        return (
          <>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              <button
                onClick={() => router.push('/dashboard/files/create')}
                className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <FilePlus className="w-4 h-4" /> Create new file
              </button>
              <button
  onClick={() => router.push('/dashboard/files/create?insert=table')}
  className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50"
>
  <Table className="w-4 h-4" /> Add a data table
</button>
              <button className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50">
                <ClipboardList className="w-4 h-4" /> Create from meetings notes
              </button>
              <button className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50">
                <LayoutTemplate className="w-4 h-4" /> Use a template
              </button>
              <button className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50">
                <UploadCloud className="w-4 h-4" /> Upload a file
              </button>
            </div>

            {/* Example file list */}
            <div className="mt-6 space-y-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">File name</div>
              <div className="bg-white border rounded-lg px-4 py-3 flex justify-between">
                <span className="text-sm">Meet Q2 Report</span>
                <span className="text-xs text-gray-500">10 hours ago by Kamaldeen</span>
              </div>
            </div>
          </>
        )
      case 'Recent':
        return <p className="text-sm text-gray-600 mt-6">Showing your recently opened files.</p>
      case 'Meeting notes':
        return  <MeetingNotesPanel />
      case 'Shared files':
        return <p className="text-sm text-gray-600 mt-6">Files others have shared with you.</p>
      case 'Favorites':
        return <p className="text-sm text-gray-600 mt-6">Your bookmarked or favorited files.</p>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
    
      {renderTabContent()}
    </div>
  )
}
