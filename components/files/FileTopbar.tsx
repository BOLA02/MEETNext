'use client'

import { ArrowLeft, Undo2, Redo2, Share2, MoreVertical, Pin, Palette, Plus, ImageIcon, Brush, Mic, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import ChecklistModal from '@/components/files/ChecklistModal'
import ShareModal from '@/components/files/ShareModal'
import { toast } from 'sonner'


interface FileTopbarProps {
  onUndo?: () => void
  onRedo?: () => void
  setShowCanvas: Dispatch<SetStateAction<boolean>>
  activeTab?: string
  setActiveTab?: Dispatch<SetStateAction<string>>
}

export default function FileTopbar({ onUndo, onRedo, setShowCanvas, activeTab, setActiveTab }: FileTopbarProps) {

  const router = useRouter();
  const { setImageSrc, addChecklistItem, setAudioURL, setBgColor, insertDataTable, reset } = useEditorStore();
  const [shareOpen, setShareOpen] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudio = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      toast.info("Recording stopped.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast.info("Recording started... Click mic again to stop.");
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        stream.getTracks().forEach(track => track.stop()); // Release the microphone
      };

      recorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error("Microphone access denied. Please allow permission in your browser settings.");
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error("No microphone found. Please connect a microphone and try again.");
      } else {
        toast.error("Could not start recording. Please check your microphone.");
      }
    }
  };

  const colors = ['bg-white', 'bg-gray-100', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-red-200'];

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/files')}>
          <ArrowLeft />
        </Button>

        <Button variant="ghost" size="icon" onClick={onUndo}><Undo2 /></Button>
        <Button variant="ghost" size="icon" onClick={onRedo}><Redo2 /></Button>
        <Button variant="ghost" size="icon" onClick={() => setShareOpen(true)}>
          <Share2 />
        </Button>

      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon"><Pin /></Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Palette /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="grid grid-cols-5 gap-2 p-2">
            {colors.map(color => (
              <div key={color} onClick={() => setBgColor(color)} className={`w-6 h-6 rounded ${color} border cursor-pointer hover:scale-110 transition-transform`} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Plus /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">

          <label className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer">
            <ImageIcon size={16} /> Upload Image
            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
          </label>

          <ChecklistModal>
            <div className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer">
              <ListTodo size={16} /> Add Checklist
            </div>
          </ChecklistModal>

          <DropdownMenuItem 
              onClick={handleAudio}
              className={`${isRecording ? 'bg-purple-100 text-purple-700 font-semibold' : ''}`}
            >
              <Mic className={`mr-2 ${isRecording ? 'animate-pulse text-purple-700' : ''}`} size={16} /> 
              {isRecording ? 'Recording...' : 'Add Audio'}
          </DropdownMenuItem>


          <DropdownMenuItem onClick={() => setShowCanvas(true)}>
            <Brush className="mr-2" size={16} /> Open Canvas
          </DropdownMenuItem>

        </DropdownMenuContent>
          
        </DropdownMenu>

        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

      </div>
    </div>
  )
}
