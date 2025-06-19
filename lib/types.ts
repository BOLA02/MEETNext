// lib/types.ts

export interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  time: string;
  type: "text" | "image" | "file";
  status?: "sent" | "delivered" | "read";
  isOwn?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: "all" | "tags" | "rooms" | "meetings";
  messages: Message[];
  isOnline?: boolean;
  participants?: string[];
  meetingTime?: string;
  isGroup?: boolean;
  createdBy?: string;
  backgroundImage?: string;
  members?: { id: string; name: string; avatar: string }[];
  pinnedMessageId?: string;
}
