import { Chat } from "./types";
export const mockChats: Chat[] = [
  {
    id: "chat1",
    name: "War room connect 2025 | Room 1",
    avatar: "/avatars/warroom.jpg",
    backgroundImage: "/meeting-bg.jpg",
    lastMessage: "Reacted 🙏 to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: true,
    isGroup: true,
    createdBy: "Kamal",
    members: [
      { id: "user1", name: "Andrew Tate", avatar: "/avatars/user1.jpg" },
      { id: "user2", name: "felix", avatar: "/avatars/user2.jpg" },
      { id: "user3", name: "kash patel", avatar: "/avatars/user3.jpg" },
      { id: "user4", name: "Ojo olukuluoye", avatar: "/avatars/user4.jpg" },
      { id: "user5", name: "Pelvin", avatar: "/avatars/user5.jpg" },
      { id: "user6", name: "Tegaa", avatar: "/avatars/user6.jpg" },
      { id: "user7", name: "~devfa", avatar: "/avatars/user7.jpg" }
    ],
    pinnedMessageId: "m2",
    messages: [
      {
        id: "m1",
        sender: "Andrew Tate",
        senderId: "user1",
        content: "The world rewards winners, if you're broke, it's your fault. Get in the gym, get your money up, and stop whining.",
        time: "11:53 PM",
        type: "text",
        status: "read",
        isOwn: false
      },
      {
        id: "m2",
        sender: "You",
        senderId: "currentUser",
        content: "When is the next bowling btw? I'm curious fr",
        time: "11:46 PM",
        type: "text",
        status: "read",
        isOwn: true
      }
    ]
  },

  {
    id: "chat2",
    name: "Product Team | Room 2",
    avatar: "/avatars/product-team.jpg",
    backgroundImage: "/meeting-bg2.jpg",
    lastMessage: "Let's finalize the product backlog.",
    timestamp: "09:00 AM",
    unread: 1,
    type: "all",
    isOnline: true,
    isGroup: true,
    createdBy: "Eve",
    members: [
      { id: "user8", name: "Eve", avatar: "/avatars/user8.jpg" },
      { id: "user9", name: "Frank", avatar: "/avatars/user9.jpg" },
      { id: "user10", name: "Grace", avatar: "/avatars/user10.jpg" }
    ],
    messages: [
      {
        id: "m1",
        sender: "Eve",
        senderId: "user8",
        content: "Let's finalize the product backlog.",
        time: "09:00 AM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },

  {
    id: "chat3",
    name: "Designers | Room 3",
    avatar: "/avatars/designers.jpg",
    backgroundImage: "/meeting-bg3.jpg",
    lastMessage: "Design review at 2 PM.",
    timestamp: "08:30 AM",
    unread: 0,
    type: "all",
    isOnline: false,
    isGroup: true,
    createdBy: "Alice",
    members: [
      { id: "user11", name: "Alice", avatar: "/avatars/user11.jpg" },
      { id: "user12", name: "Bob", avatar: "/avatars/user12.jpg" }
    ],
    messages: [
      {
        id: "m1",
        sender: "Alice",
        senderId: "user11",
        content: "Design review at 2 PM.",
        time: "08:30 AM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat4",
    name: "Marketing Team",
    avatar: "/thomas.png",
    lastMessage: "Reacted to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: false,
    isGroup: true,
    messages: [
      {
        id: "m1",
        sender: "Emily Davis",
        senderId: "user4",
        content: "The world rewards winners...",
        time: "11:45 PM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat5",
    name: "Development Team",
    avatar: "/thomas.png",
    lastMessage: "Reacted to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: true,
    isGroup: true,
    messages: [
      {
        id: "m1",
        sender: "Mike Wilson",
        senderId: "user5",
        content: "The world rewards winners...",
        time: "11:45 PM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat6",
    name: "Product Team",
    avatar: "/thomas.png",
    lastMessage: "Reacted to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: false,
    isGroup: true,
    messages: [
      {
        id: "m1",
        sender: "Lisa Brown",
        senderId: "user6",
        content: "The world rewards winners...",
        time: "11:45 PM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat7",
    name: "Sales Team",
    avatar: "/thomas.png",
    lastMessage: "Reacted to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: true,
    isGroup: true,
    messages: [
      {
        id: "m1",
        sender: "David Lee",
        senderId: "user7",
        content: "The world rewards winners...",
        time: "11:45 PM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat8",
    name: "Support Team",
    avatar: "/thomas.png",
    lastMessage: "Reacted to outreach...",
    timestamp: "10:24 AM",
    unread: 2,
    type: "all",
    isOnline: false,
    isGroup: true,
    messages: [
      {
        id: "m1",
        sender: "Alex Turner",
        senderId: "user8",
        content: "The world rewards winners...",
        time: "11:45 PM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "meeting1",
    name: "Design Review Meeting",
    avatar: "/avatars/meeting1.jpg",
    lastMessage: "Here is the latest design update.",
    timestamp: "09:30 AM",
    unread: 1,
    type: "meetings",
    isOnline: true,
    isGroup: true,
    participants: ["Alice", "Bob", "Carol"],
    meetingTime: "Mon, June 24, 9:30 AM",
    messages: [
      {
        id: "m1",
        sender: "Alice",
        senderId: "user9",
        content: "Let's review the new homepage design.",
        time: "09:31 AM",
        type: "text",
        status: "read",
        isOwn: false
      },
      {
        id: "m2",
        sender: "Bob",
        senderId: "user10",
        content: "/uploads/design-update.pdf",
        time: "09:32 AM",
        type: "file",
        status: "read",
        isOwn: false
      },
      {
        id: "m3",
        sender: "You",
        senderId: "currentUser",
        content: "/uploads/voice-note.webm",
        time: "09:33 AM",
        type: "audio",
        status: "sent",
        isOwn: true
      }
    ]
  },
  {
    id: "meeting2",
    name: "Sprint Planning",
    avatar: "/avatars/meeting2.jpg",
    lastMessage: "Let's finalize the backlog.",
    timestamp: "11:00 AM",
    unread: 0,
    type: "meetings",
    isOnline: false,
    isGroup: true,
    participants: ["David", "Eve", "Frank"],
    meetingTime: "Tue, June 25, 11:00 AM",
    messages: [
      {
        id: "m1",
        sender: "David",
        senderId: "user11",
        content: "Here are the tasks for this sprint.",
        time: "11:01 AM",
        type: "text",
        status: "read",
        isOwn: false
      },
      {
        id: "m2",
        sender: "Eve",
        senderId: "user12",
        content: "I will take the API integration.",
        time: "11:02 AM",
        type: "text",
        status: "read",
        isOwn: false
      }
    ]
  },
  {
    id: "chat_dm1",
    name: "Kamal",
    avatar: "/avatars/user13.jpg",
    lastMessage: "Thank you for sharing the documents 🙏",
    timestamp: "10:27 AM",
    unread: 0,
    type: "all",
    isOnline: true,
    isGroup: false,
    messages: [
      // ...
    ]
  }
  // more...
];
