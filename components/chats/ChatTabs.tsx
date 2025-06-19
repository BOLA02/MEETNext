// components/chats/ChatTabs.tsx
import {
  MessageCircle,
  Tag,
  Users,
  Video,
  Folder
} from "lucide-react";

const tabs = [
  { id: "all", label: "All chats", icon: MessageCircle },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "dms", label: "DMs", icon: Users },
  { id: "meetings", label: "Meeting chats", icon: Video },
  { id: "rooms", label: "Rooms", icon: Folder }
];

export default function ChatTabs({
  activeTab,
  onChange
}: {
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex justify-start gap-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-colors focus:outline-none ${
              isActive 
                ? "text-purple-600 border-purple-600 font-medium" 
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon size={18} />
            <span className="text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
