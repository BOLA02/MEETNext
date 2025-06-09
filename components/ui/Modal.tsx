'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  showCloseIcon?: boolean
}

export default function Modal({ isOpen, title, children, onClose, showCloseIcon = true }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white w-[400px] rounded-xl p-6 shadow-lg">
        {showCloseIcon && (
          <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}
