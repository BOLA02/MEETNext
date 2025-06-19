// components/chats/ChatPanel.tsx
import { useState, useRef, useEffect } from "react";
import { Chat, Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video, Search, Pin, Camera } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

function getDateLabel(dateStr: string) {
  const today = new Date();
  const msgDate = new Date();
  const [hour, minute] = dateStr.split(":");
  msgDate.setHours(Number(hour));
  msgDate.setMinutes(Number(minute));
  // For demo, just return 'Today' (real logic would compare dates)
  return "Today";
}

export default function ChatPanel({ chat }: { chat: Chat | null }) {
  const [currentChat, setCurrentChat] = useState<Chat | null>(chat);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | undefined>(chat?.pinnedMessageId);
  const [tab, setTab] = useState<'general' | 'rooms' | 'announcements'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Connect to socket and join room
  useEffect(() => {
    if (!chat) return;
    const s = io(SOCKET_URL);
    setSocket(s);
    s.emit("join", chat.id);
    s.on("chat_history", (messages: Message[]) => {
      setCurrentChat((prev) => prev ? { ...prev, messages } : null);
    });
    s.on("message", (message: Message) => {
      setCurrentChat((prev) => prev ? { ...prev, messages: [...prev.messages, message] } : null);
    });
    s.on("file", (fileMessage: Message) => {
      setCurrentChat((prev) => prev ? { ...prev, messages: [...prev.messages, fileMessage] } : null);
    });
    return () => {
      s.disconnect();
    };
  }, [chat]);

  useEffect(() => {
    setCurrentChat(chat);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (content: string) => {
    if (!currentChat || !socket) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderId: "currentUser",
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      status: "sent",
      isOwn: true,
    };
    socket.emit("message", { chatId: currentChat.id, message: newMessage });
    setCurrentChat((prev) => prev ? { ...prev, messages: [...prev.messages, newMessage], lastMessage: content, timestamp: newMessage.time } : null);
  };

  const handleSendFile = (fileUrl: string, fileName: string) => {
    if (!currentChat || !socket) return;
    const fileMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderId: "currentUser",
      content: fileUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "file",
      status: "sent",
      isOwn: true,
    };
    socket.emit("file", { chatId: currentChat.id, fileMessage });
    setCurrentChat((prev) => prev ? { ...prev, messages: [...prev.messages, fileMessage], lastMessage: fileName, timestamp: fileMessage.time } : null);
  };

  // Pin/unpin logic
  const handlePinMessage = (messageId: string) => {
    setPinnedMessageId((prev) => (prev === messageId ? undefined : messageId));
    setCurrentChat((prev) => prev ? { ...prev, pinnedMessageId: prev.pinnedMessageId === messageId ? undefined : messageId } : null);
  };

  // Image upload logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('Uploading image:', file);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      console.log('Upload response:', data);
      if (data.url) {
        setCurrentChat((prev) => prev ? {
          ...prev,
          backgroundImage: type === 'background' ? data.url : prev.backgroundImage,
          avatar: type === 'avatar' ? data.url : prev.avatar,
        } : null);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed. Please try again.');
    }
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
          <p className="text-gray-500">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  // Group/meeting header UI
  const isGroup = currentChat.isGroup;
  const isMeeting = currentChat.type === 'meetings';
  const members = currentChat.members || [];
  const showHeaderImage = isGroup && currentChat.backgroundImage;
  const pinnedMessage = currentChat.messages.find(m => m.id === (pinnedMessageId || currentChat.pinnedMessageId));

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Group/Meeting Header - Figma style */}
      {isGroup && (
        <div className="relative">
          {/* Background image with upload */}
          <div className="relative w-full h-40">
            <img
              src={currentChat.backgroundImage || "/meeting-bg.jpg"}
              alt="bg"
              className="w-full h-40 object-cover rounded-b-xl"
              onClick={() => bgInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            />
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleImageUpload(e, 'background')}
            />
            <button
              className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              onClick={() => bgInputRef.current?.click()}
              title="Change background image"
            >
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
            {/* Group avatar with upload */}
            <div className="absolute left-8 -bottom-10">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg cursor-pointer">
                  <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-3xl">
                    {currentChat.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageUpload(e, 'avatar')}
                />
                <button
                  className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Change group avatar"
                >
                  <Camera className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            {/* Host badge */}
            <div className="absolute top-4 right-24 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={members[0]?.avatar} alt={members[0]?.name} />
                <AvatarFallback>{members[0]?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full font-medium">Host: {currentChat.createdBy}</span>
            </div>
          </div>
          {/* Group name, description, members, tabs */}
          <div className="pt-16 px-8 pb-4">
            <h2 className="font-bold text-2xl text-gray-900 mb-1">{currentChat.name}</h2>
            <p className="text-gray-600 text-sm mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
            <div className="flex items-center gap-2 mb-2">
              {members.slice(0, 5).map(m => (
                <Avatar key={m.id} className="h-7 w-7 border-2 border-white -ml-2 first:ml-0">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback>{m.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 5 && (
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-1">+{members.length - 5}</span>
              )}
              <span className="text-xs text-gray-500 ml-2">{members.length} participants</span>
            </div>
            {/* Tabs */}
            <div className="flex gap-8 border-b mt-2">
              <button className={`pb-2 px-1 border-b-2 ${tab === 'general' ? 'border-black font-semibold' : 'border-transparent text-gray-500'}`} onClick={() => setTab('general')}>General</button>
              <button className={`pb-2 px-1 border-b-2 ${tab === 'rooms' ? 'border-black font-semibold' : 'border-transparent text-gray-500'}`} onClick={() => setTab('rooms')}>Rooms</button>
              <button className={`pb-2 px-1 border-b-2 ${tab === 'announcements' ? 'border-black font-semibold' : 'border-transparent text-gray-500'}`} onClick={() => setTab('announcements')}>Announcements</button>
            </div>
          </div>
        </div>
      )}
      {/* Pinned Message */}
      {pinnedMessage && (
        <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-400 px-4 py-2 mt-4 mx-4 rounded shadow">
          <Pin className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-gray-800 font-medium">{pinnedMessage.content}</span>
        </div>
      )}
      {/* Chat Header (fallback for DMs) */}
      {!isGroup && (
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                {currentChat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">{currentChat.name}</h2>
            </div>
          </div>
        </div> 
      )}
      {/* Messages Area */}
      {tab === 'general' && (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-2">
            {currentChat.messages.map((message, index) => {
              let showDateSeparator = false;
              let dateLabel = null;
              if (index === 0) {
                showDateSeparator = true;
                dateLabel = getDateLabel(message.time);
              }
              // Show sender for group chat
              const showSender = isGroup;
              return (
                <div key={message.id} className="relative group">
                  <ChatMessage
                    message={message}
                    showAvatar={
                      index === 0 ||
                      currentChat.messages[index - 1]?.senderId !== message.senderId
                    }
                    showSender={showSender}
                    showDateSeparator={showDateSeparator}
                    dateLabel={dateLabel ?? undefined}
                  />
                  <button
                    className={`absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-yellow-600`}
                    title={pinnedMessageId === message.id ? "Unpin message" : "Pin message"}
                    onClick={() => handlePinMessage(message.id)}
                  >
                    <Pin fill={pinnedMessageId === message.id ? "#facc15" : "none"} />
                  </button>
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}
      {/* Chat Input */}
      {tab === 'general' && <ChatInput onSendMessage={handleSendMessage} onSendFile={handleSendFile} />}
    </div>
  );
}

