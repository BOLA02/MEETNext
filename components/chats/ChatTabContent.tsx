// components/chats/ChatTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { Chat, Message } from "@/lib/types";
import ChatListPanel from "./ChatListPanel";
import ChatPanel from "./ChatPanel";

export default function ChatTabContent({ activeTab }: { activeTab: string }) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [mentions, setMentions] = useState<Message[]>([]);

  // For demo, get all chats from mockChats
  useEffect(() => {
    if (activeTab === 'mentions') {
      let currentUser = '';
      try {
        const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}');
        if (settings.firstName && settings.lastName) currentUser = `${settings.firstName} ${settings.lastName}`;
      } catch {}
      if (!currentUser) {
        const tempName = sessionStorage.getItem('meetio_temp_name');
        if (tempName) currentUser = tempName;
      }
      if (!currentUser) currentUser = 'You';
      // Aggregate all messages where user is mentioned
      const allMentions: Message[] = [];
      for (const chat of mockChats) {
        for (const msg of chat.messages) {
          if (msg.content && msg.content.includes(`@${currentUser}`)) {
            allMentions.push({ ...msg, chatName: chat.name });
          }
        }
      }
      setMentions(allMentions);
    }
  }, [activeTab]);

  return (
    <div className="flex h-full bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="w-80 border-r">
        <ChatListPanel activeTab={activeTab} onSelect={setSelectedChat} />
      </div>
      <div className="flex-1">
        {activeTab === 'mentions' ? (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Mentions</h2>
            {mentions.length === 0 ? (
              <div className="text-gray-400">No mentions yet.</div>
            ) : (
              <div className="space-y-4">
                {mentions.map((msg, i) => (
                  <div key={msg.id + i} className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded shadow">
                    <div className="text-xs text-gray-500 mb-1">In <b>{msg.chatName}</b> at {msg.time}</div>
                    <div className="font-semibold text-gray-800">{msg.sender}:</div>
                    <div className="mt-1"><span className="text-sm">{msg.content}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ChatPanel chat={selectedChat} />
        )}
      </div>
    </div>
  );
}
