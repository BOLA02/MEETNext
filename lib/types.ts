// lib/types.ts

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  type: "text"; // You can extend this
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: "all" | "tags" | "rooms";
  messages: Message[];
}
