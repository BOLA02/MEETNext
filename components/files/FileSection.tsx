'use client'

import { useState, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import { useRouter } from 'next/navigation'
import FileTopbar from './FileTopbar'
import MeetingNotesPanel from './MeetingNotesPanel'
import DrawingCanvas from './DrawingCanvas'
import { useEditorStore } from '@/lib/store/editorStore'
import {
  FilePlus,
  Table,
  ClipboardList,
  LayoutTemplate,
  UploadCloud,
  File as FileIcon,
  Image as ImageIcon,
  MoreHorizontal,
  Download,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

interface File {
  name: string
  lastModified: string
  author: string
  url?: string
  type?: string
}

export default function FileSection() {
  const [activeTab, setActiveTab] = useState('My Files')
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([
    { name: 'Meet Q2 Report.docx', lastModified: '10 hours ago', author: 'Kamaldeen' },
  ])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const { bgColor } = useEditorStore()

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setUploading(true)
    toast.info(`Uploading ${selectedFile.name}...`)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok && data.url) {
        setFiles(prevFiles => [
          ...prevFiles,
          {
            name: selectedFile.name,
            lastModified: 'Just now',
            author: 'You',
            url: data.url,
            type: selectedFile.type,
          },
        ])
        toast.success(`${selectedFile.name} uploaded successfully!`)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
      // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
    toast.success(`Deleted ${fileName}`);
  }

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
              <label className="border rounded-lg px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  ref={fileInputRef}
                />
                <UploadCloud className={`w-4 h-4 ${uploading ? 'animate-pulse' : ''}`} />
                {uploading ? 'Uploading...' : 'Upload a file'}
              </label>
            </div>

            {/* File list */}
            <div className="mt-8">
              <div className="text-sm font-semibold text-gray-700 mb-2 px-2 grid grid-cols-3 gap-4">
                <span>File name</span>
                <span>Last modified</span>
                <span>Author</span>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-lg px-4 py-3 grid grid-cols-3 gap-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <a
                      href={file.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-medium text-purple-600 hover:underline"
                    >
                      {file.type && file.type.startsWith('image/') ? (
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FileIcon className="w-5 h-5 text-gray-500" />
                      )}
                      <span>{file.name}</span>
                    </a>
                    <span className="text-xs text-gray-500">{file.lastModified}</span>
                    <span className="text-xs text-gray-500">{file.author}</span>
                    <div className="flex items-center justify-end gap-2">
                      {file.url && (
                         <a href={file.url} download={file.name} className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100">
                           <Download className="w-4 h-4" />
                         </a>
                      )}
                      <button onClick={() => handleDelete(file.name)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {uploading && (
                  <div className="bg-white border rounded-lg px-4 py-3 flex items-center justify-center text-sm text-gray-500">
                    <UploadCloud className="w-4 h-4 animate-spin mr-2" />
                    Uploading file...
                  </div>
                )}
              </div>
            </div>
          </>
        )
      case 'Recent':
        return <p className="text-sm text-gray-600 mt-6">Showing your recently opened files.</p>
      case 'Meeting notes':
        return <MeetingNotesPanel />
      case 'Shared files':
        return <p className="text-sm text-gray-600 mt-6">Files others have shared with you.</p>
      case 'Favorites':
        return <p className="text-sm text-gray-600 mt-6">Your bookmarked or favorited files.</p>
      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 p-6 min-h-screen transition-colors ${bgColor}`}>
      <FileTopbar activeTab={activeTab} setActiveTab={setActiveTab} setShowCanvas={setShowCanvas} />
      {renderTabContent()}
      {showCanvas && <DrawingCanvas onClose={() => setShowCanvas(false)} />}
    </div>
  )
}
