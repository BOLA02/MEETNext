'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ShareModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [link, setLink] = useState('https://meetio-app/files/12345')

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share file</DialogTitle>
        </DialogHeader>

        <Input value={link} readOnly className="mb-4" />

        <DialogFooter>
          <Button onClick={handleCopy}>Copy Link</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
