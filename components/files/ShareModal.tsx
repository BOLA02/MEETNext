'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ShareModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [link] = useState('https://meetio-app/files/12345')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      
      {/* Copied Animation at full dialog level */}
      {copied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 text-sm bg-purple-600 text-white px-4 py-2 rounded shadow z-50 animate-fade-in-out">
          Copied!
        </div>
      )}

      <DialogContent className="p-6 animate-modal-slide-down-fade">

        <DialogHeader>
          <DialogTitle className="text-purple-700 text-lg">Share File</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-700 mb-1">Public Link</label>
          <Input value={link} readOnly className="border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button 
            onClick={handleCopy}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            Copy Link
          </Button>

          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-purple-300 text-purple-600"
          >
            Close
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
