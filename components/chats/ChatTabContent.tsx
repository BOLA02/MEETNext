// components/chats/ChatTabContent.tsx
"use client";

import { useState } from "react";
import { Chat } from "@/lib/types";
import ChatListPanel from "./ChatListPanel";
import ChatPanel from "./ChatPanel";

export default function ChatTabContent({ activeTab }: { activeTab: string }) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-full m-5 rounded-t-lg">
      <div className="w-100 rounded-t-lg ">
        <ChatListPanel activeTab={activeTab} onSelect={setSelectedChat} />
      </div>
      <ChatPanel chat={selectedChat} />
    </div>
  );
}
