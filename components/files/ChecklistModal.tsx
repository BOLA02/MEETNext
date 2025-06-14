'use client'

import { ReactNode, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/lib/store/editorStore'

interface ChecklistModalProps {
  children: ReactNode
}

export default function ChecklistModal({ children }: ChecklistModalProps) {
  const { addChecklistItem } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() !== "") {
      addChecklistItem(input.trim());
      setInput("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-purple-600'>Add Checklist Item</DialogTitle>
        </DialogHeader>

        <input 
          type="text"
          placeholder="Enter checklist item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-3 py-2 w-full text-purple-600 focus:border-purple-600"
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}  className="bg-purple-400" >Cancel</Button>
          <Button onClick={handleAdd} className='bg-purple-600 hover:bg-purple-600'>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
