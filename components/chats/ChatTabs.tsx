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
    <div className="bg-white  px-4">
      <div className="flex justify-start gap-6 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 focus:outline-none ${
                isActive ? "text-purple-800 font-medium" : "text-purple-500"
              }`}
              style={{ minWidth: '60px' }} // consistent width for each tab
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
        {/* Progress bar */}
        <div
          className="absolute bottom-0 h-1 bg-purple-600 rounded transition-all duration-300"
          style={{
            width: '60px',
            left: `${tabs.findIndex((tab) => tab.id === activeTab) * (60 + 24)}px` // 60px tab + 24px gap
          }}
        />
      </div>
    </div>
  );
}
