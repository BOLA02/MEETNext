// Global type definitions for the Meet application

declare global {
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_WS_URL: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
    }
  }

  // Custom types for the application
  interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    participants: User[];
    host: User;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    meetingLink: string;
    recordingUrl?: string;
    notes?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'host' | 'participant' | 'admin';
    isOnline: boolean;
    lastSeen?: Date;
  }

  interface ChatMessage {
    id: string;
    content: string;
    sender: User;
    timestamp: Date;
    type: 'text' | 'file' | 'image' | 'system';
    attachments?: FileAttachment[];
  }

  interface FileAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }

  interface MeetingSettings {
    allowChat: boolean;
    allowScreenShare: boolean;
    allowRecording: boolean;
    muteOnEntry: boolean;
    videoOnEntry: boolean;
    waitingRoom: boolean;
    maxParticipants: number;
  }

  // Socket.io event types
  interface ServerToClientEvents {
    'user-joined': (user: User) => void;
    'user-left': (userId: string) => void;
    'message-received': (message: ChatMessage) => void;
    'meeting-started': (meeting: Meeting) => void;
    'meeting-ended': (meetingId: string) => void;
    'screen-share-started': (userId: string) => void;
    'screen-share-stopped': (userId: string) => void;
    'recording-started': (meetingId: string) => void;
    'recording-stopped': (meetingId: string) => void;
  }

  interface ClientToServerEvents {
    'join-meeting': (meetingId: string) => void;
    'leave-meeting': (meetingId: string) => void;
    'send-message': (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    'start-screen-share': () => void;
    'stop-screen-share': () => void;
    'start-recording': () => void;
    'stop-recording': () => void;
  }

  // Form validation types
  interface LoginFormData {
    email: string;
    password: string;
  }

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface MeetingFormData {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
    settings: MeetingSettings;
  }

  // API response types
  interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }

  interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

// Export to make this a module
export {}; 