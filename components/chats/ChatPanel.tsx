// components/chats/ChatPanel.tsx
import { Chat } from "@/lib/types";

export default function ChatPanel({ chat }: { chat: Chat | null }) {
  if (!chat) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a chat</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 ">
      <h2 className="font-semibold text-lg mb-2">{chat.name}</h2>
      <div className="space-y-2">
        {chat.messages.map((msg) => (
          <div key={msg.id} className="bg-muted p-2 rounded">
            <p className="font-medium">{msg.sender}</p>
            <p>{msg.content}</p>
            <p className="text-xs text-muted-foreground">{msg.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
