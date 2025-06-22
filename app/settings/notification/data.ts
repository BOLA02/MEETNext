import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  Save, 
  RotateCcw, 
  Search,
  Clock,
  Globe,
  Shield,
  AlertTriangle,
  X,
  Users,
  Video,
  FileText,
  MessageSquare,
  Calendar,
  Zap,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Moon,
  Sun
} from 'lucide-react'

export type NotificationItem = {
  id: string
  label: string
  description: string
  checked: boolean
  category: 'email' | 'push' | 'both'
  priority?: 'high' | 'medium' | 'low'
}

export type NotificationSection = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  items: NotificationItem[]
}

export const initialSections: NotificationSection[] = [
  {
    id: 'meetings',
    title: 'Meetings & Calls',
    description: 'Notifications for meeting activities and video calls',
    icon: Video,
    items: [
      { 
        id: 'meeting-reminders', 
        label: 'Meeting reminders', 
        description: 'Get notified before scheduled meetings start',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'meeting-updates', 
        label: 'Meeting updates', 
        description: 'When meeting details, time, or participants change',
        checked: true,
        category: 'both'
      },
      { 
        id: 'meeting-cancellations', 
        label: 'Meeting cancellations', 
        description: 'When meetings are cancelled or rescheduled',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'meeting-invitations', 
        label: 'Meeting invitations', 
        description: 'When you\'re invited to new meetings',
        checked: true,
        category: 'both'
      },
      { 
        id: 'meeting-join-requests', 
        label: 'Join meeting requests', 
        description: 'When someone requests to join your meeting',
        checked: true,
        category: 'push'
      },
      { 
        id: 'meeting-recording-ready', 
        label: 'Recording ready', 
        description: 'When meeting recordings are available',
        checked: true,
        category: 'email'
      },
      { 
        id: 'meeting-transcript-ready', 
        label: 'Transcript ready', 
        description: 'When meeting transcripts are ready for review',
        checked: false,
        category: 'email'
      },
      { 
        id: 'meeting-notes-shared', 
        label: 'Meeting notes shared', 
        description: 'When meeting notes are shared with you',
        checked: true,
        category: 'both'
      },
    ],
  },
  {
    id: 'team-chat',
    title: 'Team Chat & Messages',
    description: 'Notifications for team communication and messaging',
    icon: MessageSquare,
    items: [
      { 
        id: 'direct-messages', 
        label: 'Direct messages', 
        description: 'When someone sends you a direct message',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'mentions', 
        label: 'Mentions (@me)', 
        description: 'When you\'re mentioned in conversations',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'channel-mentions', 
        label: 'Channel mentions (@all, @here)', 
        description: 'When there are general mentions in channels',
        checked: true,
        category: 'both'
      },
      { 
        id: 'thread-replies', 
        label: 'Thread replies', 
        description: 'Replies to threads you\'re following',
        checked: true,
        category: 'email'
      },
      { 
        id: 'reactions', 
        label: 'Reactions to your messages', 
        description: 'When someone reacts to your messages',
        checked: false,
        category: 'push'
      },
      { 
        id: 'channel-updates', 
        label: 'Channel updates', 
        description: 'Important updates from channels you\'re part of',
        checked: false,
        category: 'push'
      },
    ],
  },
  {
    id: 'files-documents',
    title: 'Files & Documents',
    description: 'Notifications for file sharing and document collaboration',
    icon: FileText,
    items: [
      { 
        id: 'files-shared-with-me', 
        label: 'Files shared with me', 
        description: 'When someone shares files or documents with you',
        checked: true,
        category: 'both'
      },
      { 
        id: 'file-comments', 
        label: 'File comments', 
        description: 'Comments on files you\'ve shared or collaborated on',
        checked: true,
        category: 'push'
      },
      { 
        id: 'file-edits', 
        label: 'File edits', 
        description: 'When someone edits files you\'re collaborating on',
        checked: true,
        category: 'email'
      },
      { 
        id: 'file-version-updates', 
        label: 'File version updates', 
        description: 'When new versions of shared files are uploaded',
        checked: false,
        category: 'email'
      },
      { 
        id: 'document-approvals', 
        label: 'Document approvals', 
        description: 'When documents need your approval',
        checked: true,
        category: 'both',
        priority: 'high'
      },
    ],
  },
  {
    id: 'calendar-events',
    title: 'Calendar & Events',
    description: 'Notifications for calendar events and scheduling',
    icon: Calendar,
    items: [
      { 
        id: 'event-reminders', 
        label: 'Event reminders', 
        description: 'Reminders for upcoming calendar events',
        checked: true,
        category: 'both'
      },
      { 
        id: 'event-conflicts', 
        label: 'Event conflicts', 
        description: 'When new events conflict with existing ones',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'calendar-sync', 
        label: 'Calendar sync updates', 
        description: 'Updates from connected calendar services',
        checked: false,
        category: 'email'
      },
      { 
        id: 'availability-updates', 
        label: 'Team availability updates', 
        description: 'When team members update their availability',
        checked: false,
        category: 'push'
      },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI & Smart Features',
    description: 'Notifications for AI-powered actions and insights',
    icon: Zap,
    items: [
      { 
        id: 'ai-summary-ready', 
        label: 'AI Summary ready', 
        description: 'When AI-generated summaries of your meetings are ready',
        checked: true,
        category: 'email'
      },
      { 
        id: 'ai-action-items', 
        label: 'AI action items assigned', 
        description: 'When AI assigns action items to you',
        checked: true,
        category: 'both'
      },
      { 
        id: 'ai-insights', 
        label: 'AI-powered insights', 
        description: 'Periodic insights and suggestions from the AI assistant',
        checked: false,
        category: 'push'
      },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    description: 'Notifications for account security and login activity',
    icon: Shield,
    items: [
      { 
        id: 'new-login', 
        label: 'New login detected', 
        description: 'Get notified when your account is logged in from a new device',
        checked: true,
        category: 'email',
        priority: 'high'
      },
      { 
        id: 'password-change', 
        label: 'Password changed', 
        description: 'Confirmation when your password has been changed',
        checked: true,
        category: 'email'
      },
      { 
        id: 'security-alerts', 
        label: 'Security alerts', 
        description: 'Important security-related announcements',
        checked: true,
        category: 'both',
        priority: 'high'
      },
    ],
  },
] 