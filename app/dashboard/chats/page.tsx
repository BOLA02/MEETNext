// app/dashboard/chats/page.tsx
"use client";

import { useState } from "react";
import ChatTabs from "@/components/chats/ChatTabs";
import ChatTabContent from "@/components/chats/ChatTabContent";

export default function ChatsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <ChatTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 p-6">
        <ChatTabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
