'use client'

import { Mic, Video, Monitor, PhoneOff, Hand, Smile, Captions, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MeetingToolbar() {
  return (
    <div className="flex justify-center gap-4 bg-black/90 p-4 fixed bottom-0 w-full">
      <ToolbarButton icon={<Mic />} label="Mute" />
      <ToolbarButton icon={<Video />} label="Stop video" />
      <ToolbarButton icon={<Monitor />} label="Share" />
      <ToolbarButton icon={<PhoneOff />} label="Leave call" red />
      <ToolbarButton icon={<Hand />} label="Raise hand" />
      <ToolbarButton icon={<Smile />} label="Stickers" />
      <ToolbarButton icon={<Captions />} label="Captions" />
      <ToolbarButton icon={<MoreHorizontal />} label="More" />
    </div>
  )
}

function ToolbarButton({ icon, label, red = false }: { icon: React.ReactNode, label: string, red?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        className={`rounded-full w-14 h-14 ${red ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-black'}`}
        size="icon"
      >
        {icon}
      </Button>
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}
