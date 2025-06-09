import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChats } from "@/lib/mockData";
import { Chat } from "@/lib/types";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

export default function ChatListPanel({
  activeTab,
  onSelect
}: {
  activeTab: string;
  onSelect: (chat: Chat) => void;
}) {
  const [query, setQuery] = useState("");

  const chats = useMemo(() => {
    return mockChats.filter(
      (chat) =>
        (activeTab === "all" || chat.type === activeTab) &&
        chat.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [activeTab, query]);

  return (
    <div className="bg-[#F9F9F9] h-full flex flex-col rounded-t-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold text-purple-800">All chats</h2>
        <Filter className="w-5 h-5 text-purple-500 cursor-pointer" />
      </div>

      {/* Search bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
          <Input
            placeholder="Search or start a new chat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-3 py-2 rounded-md text-sm bg-white border border-purple-300 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelect(chat)}
              className="flex items-center px-4 py-3 hover:bg-purple-200 cursor-pointer"
            >
              {/* Avatar */}
              <Avatar className="h-10 w-10 mr-3">
                {chat.avatar ? (
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                ) : (
                  <AvatarFallback>
                    {chat.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{chat.name}</p>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {chat.unread > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
