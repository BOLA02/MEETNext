"use client";
import { useEffect, useState } from "react";
import { Message } from "@/lib/types";
import { mockChats } from "@/lib/mockData";

export default function MentionsPage() {
  const [mentions, setMentions] = useState<Message[]>([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
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
  );
} 