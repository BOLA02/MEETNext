'use client'

import { useState, useEffect } from 'react'
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

type NotificationItem = {
  id: string
  label: string
  description: string
  checked: boolean
  category: 'email' | 'push' | 'both'
  priority?: 'high' | 'medium' | 'low'
}

type NotificationSection = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  items: NotificationItem[]
}

const initialSections: NotificationSection[] = [
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
    description: 'Notifications for AI-powered features and insights',
    icon: Zap,
    items: [
      { 
        id: 'ai-insights', 
        label: 'AI insights', 
        description: 'Smart insights and recommendations',
        checked: true,
        category: 'email'
      },
      { 
        id: 'ai-summaries', 
        label: 'AI meeting summaries', 
        description: 'When AI-generated meeting summaries are ready',
        checked: true,
        category: 'both'
      },
      { 
        id: 'ai-suggestions', 
        label: 'AI suggestions', 
        description: 'Smart suggestions for meetings and scheduling',
        checked: false,
        category: 'push'
      },
      { 
        id: 'ai-translations', 
        label: 'AI translations', 
        description: 'When AI translations are completed',
        checked: false,
        category: 'email'
      },
    ],
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    description: 'Important security and privacy notifications',
    icon: Shield,
    items: [
      { 
        id: 'login-alerts', 
        label: 'Login alerts', 
        description: 'New device or location login notifications',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'password-changes', 
        label: 'Password changes', 
        description: 'When your password is changed',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'security-updates', 
        label: 'Security updates', 
        description: 'Important security updates and alerts',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'privacy-settings', 
        label: 'Privacy setting changes', 
        description: 'When privacy settings are modified',
        checked: true,
        category: 'email'
      },
      { 
        id: 'data-export', 
        label: 'Data export requests', 
        description: 'When data export requests are completed',
        checked: true,
        category: 'email'
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations & Apps',
    description: 'Notifications from connected apps and integrations',
    icon: Settings,
    items: [
      { 
        id: 'integration-updates', 
        label: 'Integration updates', 
        description: 'Updates from connected third-party apps',
        checked: true,
        category: 'email'
      },
      { 
        id: 'integration-errors', 
        label: 'Integration errors', 
        description: 'When integrations encounter errors',
        checked: true,
        category: 'both',
        priority: 'high'
      },
      { 
        id: 'new-integrations', 
        label: 'New integrations available', 
        description: 'When new integrations become available',
        checked: false,
        category: 'email'
      },
      { 
        id: 'webhook-events', 
        label: 'Webhook events', 
        description: 'Important webhook notifications',
        checked: false,
        category: 'push'
      },
    ],
  },
]

const LS_KEY = 'notification_settings_v1'

function NotificationItem({ 
  item, 
  onToggle 
}: {
  item: NotificationItem
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        id={item.id}
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
            {item.label}
          </label>
          {item.priority === 'high' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              High
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {item.description}
        </p>
        <div className="flex items-center space-x-2 mt-2">
          {item.category === 'email' && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </span>
          )}
          {item.category === 'push' && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              <Smartphone className="w-3 h-3 mr-1" />
              Push
            </span>
          )}
          {item.category === 'both' && (
            <>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                <Mail className="w-3 h-3 mr-1" />
                Email
              </span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                <Smartphone className="w-3 h-3 mr-1" />
                Push
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ResetConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Reset Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to reset all notification settings to their default values?
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-800">
                <strong>Warning:</strong> This action cannot be undone. All your custom notification preferences will be lost.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NotificationSettingsPage() {
  const [sections, setSections] = useState<NotificationSection[]>(initialSections)
  const [search, setSearch] = useState('')
  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    soundEnabled: true,
    highPriorityOnly: false
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSections(parsed.sections || initialSections)
        setGlobalSettings(parsed.globalSettings || globalSettings)
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(LS_KEY, JSON.stringify({ sections, globalSettings }))
        setHasChanges(false)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [sections, globalSettings, hasChanges])

  const handleToggle = (itemId: string) => {
    setSections(prev => 
      prev.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }))
    )
    setHasChanges(true)
  }

  const handleGlobalSettingChange = (key: string, value: boolean) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleQuietHoursChange = (key: string, value: string | boolean) => {
    setGlobalSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleReset = () => {
    setSections(initialSections)
    setGlobalSettings({
      emailNotifications: true,
      pushNotifications: true,
      doNotDisturb: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      soundEnabled: true,
      highPriorityOnly: false
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ sections, globalSettings }))
    setHasChanges(false)
  }

  const filteredSections = search.trim() 
    ? sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : sections

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage how and when you receive notifications across all features
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-orange-600 border-orange-200">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notification settings..."
          className="pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 w-full"
        />
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-lg p-6 shadow border">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Global Notification Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.emailNotifications}
                onChange={(e) => handleGlobalSettingChange('emailNotifications', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Push Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications on your device</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.pushNotifications}
                onChange={(e) => handleGlobalSettingChange('pushNotifications', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Sound & Vibration</label>
                <p className="text-xs text-gray-500">Play sounds for notifications</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.soundEnabled}
                onChange={(e) => handleGlobalSettingChange('soundEnabled', e.target.checked)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Do Not Disturb</label>
                <p className="text-xs text-gray-500">Pause all notifications temporarily</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.doNotDisturb}
                onChange={(e) => handleGlobalSettingChange('doNotDisturb', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">High Priority Only</label>
                <p className="text-xs text-gray-500">Only show high priority notifications</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.highPriorityOnly}
                onChange={(e) => handleGlobalSettingChange('highPriorityOnly', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Quiet Hours</label>
                <p className="text-xs text-gray-500">Reduce notifications during specific hours</p>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.quietHours.enabled}
                onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              />
            </div>
          </div>
        </div>
        
        {globalSettings.quietHours.enabled && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-2 mb-3">
              <Moon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Quiet Hours Schedule</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Start Time</label>
                <input
                  type="time"
                  value={globalSettings.quietHours.start}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">End Time</label>
                <input
                  type="time"
                  value={globalSettings.quietHours.end}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {filteredSections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.id} className="bg-white rounded-lg p-6 shadow border">
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
      />
    </div>
  )
}
