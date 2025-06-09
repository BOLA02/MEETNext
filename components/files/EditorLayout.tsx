'use client'

import {
  ArrowLeft,
  CornerUpLeft,
  CornerUpRight,
  Share2,
  MoreVertical,
  Pin,
  Palette,
  Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

interface Props {
  children: ReactNode
  dropdownOptions?: ReactNode
}

export default function EditorLayout({ children, dropdownOptions }: Props) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [bgColor, setBgColor] = useState<string>('bg-white')


  return (
    <div className="px-6 py-4">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/files')}>
            <ArrowLeft />
          </button>
          <CornerUpLeft />
          <CornerUpRight />
          <Share2 />
        </div>

        <div className="flex items-center gap-4 relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <MoreVertical />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-8 w-48 bg-white border rounded shadow z-50">
              {dropdownOptions || (
                <>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Add to favorites</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Copy to</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Move to</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Copy link</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Save to templates</button>
                </>
              )}
            </div>
          )}
          <Pin />
          <div className="relative">
            <button onClick={() => setShowPalette(!showPalette)}>
                <Palette />
            </button>

            {showPalette && (
                <div className="absolute top-8 right-0 bg-white shadow rounded p-2 grid grid-cols-5 gap-2 z-50">
                {['bg-white', 'bg-gray-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100'].map((color) => (
                    <button
                    key={color}
                    onClick={() => {
                        setBgColor(color)
                        setShowPalette(false)
                    }}
                    className={`w-6 h-6 rounded ${color}`}
                    />
                ))}
                </div>
            )}
            </div>

          <Plus />
        </div>
      </div>

      {/* Editor Body */}
     <div className={`mt-12 px-8 rounded-lg p-4 transition-colors duration-300 ${bgColor}`}>
  {children}
</div>

    </div>
  )
}
