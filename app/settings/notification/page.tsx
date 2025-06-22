'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  Save, 
  RotateCcw, 
  Search,
  Volume2,
  VolumeX,
  Clock,
  Globe,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { DebouncedInput, usePerformanceMonitor } from '@/components/PerformanceOptimizer'

type NotificationItem = {
  id: string
  label: string
  description: string
  checked: boolean
  category: 'email' | 'push' | 'both'
}

type NotificationSection = {
  id: string
  title: string
  description: string
  icon: any
  items: NotificationItem[]
}

const initialSections: NotificationSection[] = [
  {
    id: 'team-chat',
    title: 'Team Chat',
    description: 'Notifications for team communication',
    icon: Globe,
    items: [
      { 
        id: 'direct-messages', 
        label: 'Direct messages', 
        description: 'Get notified when someone sends you a direct message',
        checked: true,
        category: 'both'
      },
      { 
        id: 'mentions', 
        label: 'Mentions (@me or @all)', 
        description: 'Notifications when you\'re mentioned in conversations',
        checked: true,
        category: 'both'
      },
      { 
        id: 'replies', 
        label: 'Replies to threads I follow', 
        description: 'Get notified of replies to threads you\'re following',
        checked: true,
        category: 'email'
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
    id: 'meetings',
    title: 'Meetings',
    description: 'Meeting-related notifications',
    icon: Clock,
    items: [
      { 
        id: 'recording-ready', 
        label: 'Meeting recording ready', 
        description: 'When your meeting recording is available',
        checked: true,
        category: 'both'
      },
      { 
        id: 'transcript-ready', 
        label: 'Meeting transcript ready', 
        description: 'When meeting transcript is ready for review',
        checked: false,
        category: 'email'
      },
      { 
        id: 'missed-calls', 
        label: 'Missed video calls', 
        description: 'Notifications for missed video calls',
        checked: true,
        category: 'push'
      },
      { 
        id: 'meeting-reminders', 
        label: 'Meeting reminders', 
        description: 'Reminders before scheduled meetings',
        checked: true,
        category: 'both'
      },
    ],
  },
  {
    id: 'whiteboard',
    title: 'Whiteboard',
    description: 'Whiteboard collaboration notifications',
    icon: Settings,
    items: [
      { 
        id: 'whiteboard-added', 
        label: 'Added to a whiteboard', 
        description: 'When you\'re added to a whiteboard',
        checked: true,
        category: 'both'
      },
      { 
        id: 'whiteboard-mentions', 
        label: 'Mentions @me', 
        description: 'When you\'re mentioned on a whiteboard',
        checked: false,
        category: 'push'
      },
      { 
        id: 'whiteboard-changes', 
        label: 'Whiteboard changes', 
        description: 'When someone makes changes to your whiteboards',
        checked: true,
        category: 'email'
      },
    ],
  },
  {
    id: 'notes',
    title: 'Notes & Files',
    description: 'Document and file sharing notifications',
    icon: Shield,
    items: [
      { 
        id: 'shared-with-me', 
        label: 'Shared with me', 
        description: 'When someone shares notes or files with you',
        checked: true,
        category: 'both'
      },
      { 
        id: 'file-comments', 
        label: 'File comments', 
        description: 'Comments on files you\'ve shared',
        checked: true,
        category: 'push'
      },
    ],
  },
]

const LS_KEY = 'notification_settings_v1'

// Memoized notification item component
const NotificationItem = memo(({ 
  item, 
  onToggle 
}: {
  item: NotificationItem
  onToggle: (id: string) => void
}) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <Checkbox
      id={item.id}
      checked={item.checked}
      onCheckedChange={() => onToggle(item.id)}
      className="mt-1"
    />
    <div className="flex-1 min-w-0">
      <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
        {item.label}
      </Label>
      <p className="text-xs text-gray-500 mt-1">
        {item.description}
      </p>
      <div className="flex items-center space-x-2 mt-2">
        {item.category === 'email' && (
          <Badge variant="outline" className="text-xs">
            <Mail className="w-3 h-3 mr-1" />
            Email
          </Badge>
        )}
        {item.category === 'push' && (
          <Badge variant="outline" className="text-xs">
            <Smartphone className="w-3 h-3 mr-1" />
            Push
          </Badge>
        )}
        {item.category === 'both' && (
          <>
            <Badge variant="outline" className="text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Smartphone className="w-3 h-3 mr-1" />
              Push
            </Badge>
          </>
        )}
      </div>
    </div>
  </div>
))

NotificationItem.displayName = 'NotificationItem'

export default function NotificationSettingsPage() {
  const { renderCount } = usePerformanceMonitor('NotificationSettings')
  
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
    }
  })
  const [hasChanges, setHasChanges] = useState(false)

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

  // Save settings to localStorage with debouncing
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(LS_KEY, JSON.stringify({ sections, globalSettings }))
        setHasChanges(false)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [sections, globalSettings, hasChanges])

  // Memoized toggle handler
  const handleToggle = useCallback((itemId: string) => {
    setSections(prev => 
      prev.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }))
    )
    setHasChanges(true)
  }, [])

  // Memoized global settings handlers
  const handleGlobalSettingChange = useCallback((key: string, value: boolean) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }, [])

  // Memoized reset handler
  const handleReset = useCallback(() => {
    setSections(initialSections)
    setGlobalSettings({
      emailNotifications: true,
      pushNotifications: true,
      doNotDisturb: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    })
    setHasChanges(true)
    toast.success('Settings reset to defaults')
  }, [])

  // Memoized save handler
  const handleSave = useCallback(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ sections, globalSettings }))
    setHasChanges(false)
    toast.success('Notification settings saved')
  }, [sections, globalSettings])

  // Memoized filtered sections
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sections
    
    return sections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(section => section.items.length > 0)
  }, [sections, search])

  // Memoized global settings card
  const globalSettingsCard = useMemo(() => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Global Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Email Notifications</Label>
            <p className="text-xs text-gray-500">Receive notifications via email</p>
          </div>
          <Switch
            checked={globalSettings.emailNotifications}
            onCheckedChange={(checked) => handleGlobalSettingChange('emailNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Push Notifications</Label>
            <p className="text-xs text-gray-500">Receive notifications on your device</p>
          </div>
          <Switch
            checked={globalSettings.pushNotifications}
            onCheckedChange={(checked) => handleGlobalSettingChange('pushNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Do Not Disturb</Label>
            <p className="text-xs text-gray-500">Pause all notifications temporarily</p>
          </div>
          <Switch
            checked={globalSettings.doNotDisturb}
            onCheckedChange={(checked) => handleGlobalSettingChange('doNotDisturb', checked)}
          />
        </div>
      </CardContent>
    </Card>
  ), [globalSettings, handleGlobalSettingChange])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage how and when you receive notifications
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Unsaved changes
            </Badge>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <DebouncedInput
          value={search}
          onChange={setSearch}
          placeholder="Search notification settings..."
          className="pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 w-full"
          delay={200}
        />
      </div>

      {/* Global Settings */}
      {globalSettingsCard}

      {/* Notification Categories */}
      <div className="space-y-6">
        {filteredSections.map((section) => {
          const IconComponent = section.icon
          
          return (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className="w-5 h-5 text-purple-600" />
                  <span>{section.title}</span>
                </CardTitle>
                <p className="text-sm text-gray-600">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.items.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                  />
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  )
}
