// components/chats/ChatTabContent.tsx
"use client";

import { useState } from "react";
import { Chat } from "@/lib/types";
import ChatListPanel from "./ChatListPanel";
import ChatPanel from "./ChatPanel";

export default function ChatTabContent({ activeTab }: { activeTab: string }) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-full bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="w-80 border-r">
        <ChatListPanel activeTab={activeTab} onSelect={setSelectedChat} />
      </div>
      <div className="flex-1">
        <ChatPanel chat={selectedChat} />
      </div>
    </div>
  );
}
