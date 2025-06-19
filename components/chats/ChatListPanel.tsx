import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChats } from "@/lib/mockData";
import { Chat } from "@/lib/types";
import { useMemo, useState } from "react";
import { Filter, Search, Plus, Users, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { v4 as uuidv4 } from 'uuid';

export default function ChatListPanel({
  activeTab,
  onSelect
}: {
  activeTab: string;
  onSelect: (chat: Chat) => void;
}) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatIsGroup, setNewChatIsGroup] = useState(false);
  const [localChats, setLocalChats] = useState<typeof mockChats>(mockChats);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const chats = useMemo(() => {
    return localChats.filter(
      (chat) =>
        (activeTab === "all" || chat.type === activeTab) &&
        chat.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [activeTab, query, localChats]);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;
    const newChat: Chat = {
      id: uuidv4(),
      name: newChatName.trim(),
      avatar: "",
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      type: "all",
      isOnline: true,
      isGroup: newChatIsGroup,
      messages: [],
    };
    setLocalChats([newChat, ...localChats]);
    setModalOpen(false);
    setNewChatName("");
    setNewChatIsGroup(false);
    onSelect(newChat);
  };

  const handleDeleteChat = (id: string) => {
    setLocalChats(localChats.filter(chat => chat.id !== id));
    setDeleteId(null);
  };

  return (
    <>
      <Modal isOpen={modalOpen} title="Start a new chat" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleCreateChat}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Chat name..."
            value={newChatName}
            onChange={e => setNewChatName(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newChatIsGroup}
              onChange={e => setNewChatIsGroup(e.target.checked)}
            />
            This is a group chat
          </label>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">Start chat</button>
        </form>
      </Modal>
      <Modal isOpen={!!deleteId} title="Delete chat?" onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <p>Are you sure you want to delete this chat? This cannot be undone.</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteChat(deleteId!)}>Delete</button>
          </div>
        </div>
      </Modal>
      <div className="bg-white h-full flex flex-col border-r overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">All chats</h2>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm font-medium shadow"
            title="Start a new chat"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search or start a new chat"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg text-sm bg-gray-50 border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => onSelect(chat)}
              >
                {/* Avatar with online status or group icon */}
                <div className="relative mr-3">
                  {chat.isGroup ? (
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold border-2 border-purple-200">
                      <Users className="w-6 h-6" />
                    </div>
                  ) : (
                    <>
                      <Avatar className="h-12 w-12">
                        {chat.avatar ? (
                          <AvatarImage src={chat.avatar} alt={chat.name} />
                        ) : (
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {chat.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{chat.name}</p>
                      {chat.type === 'meetings' && chat.meetingTime && (
                        <p className="text-xs text-gray-500 truncate">{chat.meetingTime}</p>
                      )}
                      {chat.type === 'meetings' && chat.participants && (
                        <p className="text-xs text-gray-400 truncate">{chat.participants.join(', ')}</p>
                      )}
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-gray-400 mb-1">
                        {chat.timestamp}
                      </span>
                      {chat.unread > 0 && (
                        <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                      <button
                        className="mt-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-600"
                        title="Delete chat"
                        onClick={e => { e.stopPropagation(); setDeleteId(chat.id); }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
