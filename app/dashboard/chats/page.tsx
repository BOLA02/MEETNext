// app/dashboard/chats/page.tsx
"use client";

import { useState } from "react";
import ChatTabs from "@/components/chats/ChatTabs";
import ChatTabContent from "@/components/chats/ChatTabContent";

export default function ChatsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col h-full">
      <ChatTabs activeTab={activeTab} onChange={setActiveTab} />
      <ChatTabContent activeTab={activeTab} />
    </div>
  );
}
