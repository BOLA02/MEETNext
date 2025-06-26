// app/dashboard/chats/page.tsx
"use client";

import { useState } from "react";
import ChatListPanel from "@/components/chats/ChatListPanel";
import ChatPanel from "@/components/chats/ChatPanel";
import { mockChats } from "@/lib/mockData";

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState(mockChats[0] || null);

  return (
    <div className="flex flex-1 min-h-0 w-full">
      {/* Chat list sidebar */}
      <div className="w-80 border-r bg-white flex flex-col min-h-0">
        <ChatListPanel
          activeTab="all"
          onSelect={chat => setActiveChat(chat)}
        />
      </div>
      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-h-0 bg-white">
        <ChatPanel chat={activeChat} />
      </main>
      {/* Right panel placeholder */}
      <aside className="w-80 border-l bg-gray-50 flex flex-col min-h-0 p-6 hidden xl:block">
        {/* Future: clock, calendar, meeting info widgets */}
        <div className="text-gray-400 text-center mt-20">Widgets coming soon…</div>
      </aside>
    </div>
  );
}
