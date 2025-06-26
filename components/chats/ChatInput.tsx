import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, Mic, StopCircle, Trash2 } from "lucide-react";
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (fileUrl: string, fileName: string, fileType?: string) => void;
  disabled?: boolean;
  users?: { id: string; name: string; avatar?: string }[];
}

export default function ChatInput({ onSendMessage, onSendFile, disabled = false, users = [] }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mentionDropdown, setMentionDropdown] = useState({ open: false, query: '', position: 0 });
  const [mentionIndex, setMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const mentionUsers = users.filter(u => u.name.toLowerCase().includes(mentionDropdown.query.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    const cursor = e.target.selectionStart || 0;
    const textBefore = value.slice(0, cursor);
    const match = textBefore.match(/@([\w]*)$/);
    if (match) {
      setMentionDropdown({ open: true, query: match[1], position: cursor });
      setMentionIndex(0);
    } else {
      setMentionDropdown({ open: false, query: '', position: 0 });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mentionDropdown.open && mentionUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(i => (i + 1) % mentionUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(i => (i - 1 + mentionUsers.length) % mentionUsers.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertMention(mentionUsers[mentionIndex]);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        insertMention(mentionUsers[mentionIndex]);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertMention = (user: { id: string; name: string }) => {
    if (!inputRef.current) return;
    const cursor = inputRef.current.selectionStart || 0;
    const value = message;
    const textBefore = value.slice(0, cursor);
    const textAfter = value.slice(cursor);
    const match = textBefore.match(/@([\w]*)$/);
    if (match) {
      const start = match.index ?? 0;
      const newValue = textBefore.slice(0, start) + '@' + user.name + ' ' + textAfter;
      setMessage(newValue);
      setMentionDropdown({ open: false, query: '', position: 0 });
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(start + user.name.length + 2, start + user.name.length + 2);
        }
      }, 0);
    }
  };

  const handleSend = () => {
    if (audioPreview && audioBlob && onSendFile) {
      // Upload and send audio
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-message.webm');
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            onSendFile(data.url, 'voice-message.webm', 'audio');
            setAudioPreview(null);
            setAudioBlob(null);
          }
        });
      return;
    }
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url && onSendFile) {
      onSendFile(data.url, file.name, file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : 'file');
    }
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + (emoji.native || ''));
    setShowEmoji(false);
  };

  // Voice recording logic
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) {
      alert('Audio recording is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioPreview(URL.createObjectURL(audioBlob));
        setAudioChunks([]);
      };
      recorder.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone not found or permission denied. Please check your device and browser settings.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleDeleteAudio = () => {
    setAudioPreview(null);
    setAudioBlob(null);
  };

  return (
    <div className="border-t bg-white p-4 relative">
      {showEmoji && (
        <div className="absolute bottom-16 right-16 z-50 bg-white border rounded shadow-lg">
          <Picker onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          {audioPreview ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <audio src={audioPreview} controls className="w-40" />
              <Button size="icon" variant="ghost" onClick={handleDeleteAudio} className="text-red-500"><Trash2 /></Button>
            </div>
          ) : (
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder={recording ? "Recording..." : "Type a message..."}
              className="pr-28 py-3 rounded-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              disabled={disabled || recording}
            />
          )}
          {mentionDropdown.open && mentionUsers.length > 0 && (
            <div className="absolute left-4 bottom-12 z-50 bg-white border rounded shadow-lg w-64 max-h-60 overflow-y-auto">
              {mentionUsers.map((user, i) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-100 ${i === mentionIndex ? 'bg-purple-50' : ''}`}
                  onMouseDown={e => { e.preventDefault(); insertMention(user); }}
                >
                  {user.avatar && <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />}
                  <span className="font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              disabled={disabled || recording || !!audioPreview}
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              disabled={disabled || recording || !!audioPreview}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || recording || !!audioPreview}
            />
            {!recording && !audioPreview ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                disabled={disabled}
                type="button"
                onClick={handleStartRecording}
              >
                <Mic className="h-4 w-4" />
              </Button>
            ) : null}
            {recording && !audioPreview ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 animate-pulse"
                type="button"
                onClick={handleStopRecording}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !audioPreview) || disabled || recording}
          className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 