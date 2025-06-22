'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  Video, 
  Mic, 
  Settings, 
  Search,
  Save,
  RotateCcw,
  Download,
  Trash2,
  HardDrive,
  Clock,
  Eye,
  EyeOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Zap,
  FileVideo,
  FileAudio,
  Cloud,
  Database
} from 'lucide-react'
import { toast } from 'sonner'
import { DebouncedInput, usePerformanceMonitor } from '@/components/PerformanceOptimizer'

type RecordingSetting = {
  id: string
  label: string
  description: string
  enabled: boolean
  category: 'general' | 'quality' | 'storage' | 'ai' | 'access'
  critical?: boolean
}

type QualitySetting = {
  id: string
  label: string
  value: string | number
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

const recordingSettings: RecordingSetting[] = [
  {
    id: 'auto-record',
    label: 'Automatic Recording',
    description: 'Start recording automatically when meetings begin',
    enabled: false,
    category: 'general'
  },
  {
    id: 'record-audio',
    label: 'Record Audio',
    description: 'Include audio in recordings',
    enabled: true,
    category: 'general'
  },
  {
    id: 'record-video',
    label: 'Record Video',
    description: 'Include video in recordings',
    enabled: true,
    category: 'general'
  },
  {
    id: 'record-screen',
    label: 'Record Screen Share',
    description: 'Include screen sharing in recordings',
    enabled: true,
    category: 'general'
  },
  {
    id: 'ai-highlights',
    label: 'AI-Generated Highlights',
    description: 'Automatically create highlight clips',
    enabled: false,
    category: 'ai'
  },
  {
    id: 'ai-transcription',
    label: 'AI Transcription',
    description: 'Generate automatic transcripts',
    enabled: true,
    category: 'ai'
  },
  {
    id: 'access-control',
    label: 'Access Control',
    description: 'Limit recording access to hosts only',
    enabled: false,
    category: 'access'
  },
  {
    id: 'cloud-storage',
    label: 'Cloud Storage',
    description: 'Store recordings in cloud for backup',
    enabled: true,
    category: 'storage'
  },
  {
    id: 'local-storage',
    label: 'Local Storage',
    description: 'Keep recordings on local device',
    enabled: false,
    category: 'storage'
  }
]

const qualitySettings: QualitySetting[] = [
  {
    id: 'video-quality',
    label: 'Video Quality',
    value: '1080p',
    options: ['720p', '1080p', '1440p', '4K']
  },
  {
    id: 'audio-quality',
    label: 'Audio Quality',
    value: '128kbps',
    options: ['64kbps', '128kbps', '256kbps', '320kbps']
  },
  {
    id: 'frame-rate',
    label: 'Frame Rate',
    value: 30,
    min: 15,
    max: 60,
    step: 5,
    unit: 'fps'
  },
  {
    id: 'bitrate',
    label: 'Video Bitrate',
    value: 5000,
    min: 1000,
    max: 20000,
    step: 500,
    unit: 'kbps'
  }
]

const LS_KEY = 'recording_settings_v1'

// Memoized recording setting component
const RecordingSettingItem = memo(({ 
  setting, 
  onToggle 
}: {
  setting: RecordingSetting
  onToggle: (id: string) => void
}) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium cursor-pointer">
          {setting.label}
        </Label>
        {setting.critical && (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {setting.description}
      </p>
    </div>
    <Switch
      checked={setting.enabled}
      onCheckedChange={() => onToggle(setting.id)}
      className="data-[state=checked]:bg-purple-600"
    />
  </div>
))

RecordingSettingItem.displayName = 'RecordingSettingItem'

// Memoized quality setting component
const QualitySettingItem = memo(({ 
  setting, 
  onValueChange 
}: {
  setting: QualitySetting
  onValueChange: (id: string, value: string | number) => void
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg border">
    <div className="flex-1">
      <Label className="text-sm font-medium">
        {setting.label}
      </Label>
      {setting.unit && (
        <p className="text-xs text-gray-500 mt-1">
          Current: {setting.value}{setting.unit}
        </p>
      )}
    </div>
    
    <div className="flex items-center space-x-3">
      {setting.options ? (
        <Select
          value={setting.value as string}
          onValueChange={(value) => onValueChange(setting.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {setting.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center space-x-3 w-48">
          <Slider
            value={[setting.value as number]}
            onValueChange={([value]) => onValueChange(setting.id, value)}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {setting.value}{setting.unit}
          </span>
        </div>
      )}
    </div>
  </div>
))

QualitySettingItem.displayName = 'QualitySettingItem'

export default function RecordingSettings() {
  const { renderCount } = usePerformanceMonitor('RecordingSettings')
  
  const [search, setSearch] = useState('')
  const [recordingConfig, setRecordingConfig] = useState<RecordingSetting[]>(recordingSettings)
  const [qualityConfig, setQualityConfig] = useState<QualitySetting[]>(qualitySettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [storageUsed, setStorageUsed] = useState(2.4) // GB
  const [storageLimit, setStorageLimit] = useState(10) // GB

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecordingConfig(parsed.recording || recordingSettings)
        setQualityConfig(parsed.quality || qualitySettings)
      } catch (error) {
        console.error('Failed to load recording settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage with debouncing
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(LS_KEY, JSON.stringify({
          recording: recordingConfig,
          quality: qualityConfig
        }))
        setHasChanges(false)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [recordingConfig, qualityConfig, hasChanges])

  // Memoized toggle handlers
  const handleRecordingToggle = useCallback((id: string) => {
    setRecordingConfig(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
    setHasChanges(true)
  }, [])

  const handleQualityChange = useCallback((id: string, value: string | number) => {
    setQualityConfig(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    )
    setHasChanges(true)
  }, [])

  // Memoized filtered settings
  const filteredRecording = useMemo(() => {
    if (!search.trim()) return recordingConfig
    
    return recordingConfig.filter(setting =>
      setting.label.toLowerCase().includes(search.toLowerCase()) ||
      setting.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [recordingConfig, search])

  const filteredQuality = useMemo(() => {
    if (!search.trim()) return qualityConfig
    
    return qualityConfig.filter(setting =>
      setting.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [qualityConfig, search])

  // Memoized reset handler
  const handleReset = useCallback(() => {
    setRecordingConfig(recordingSettings)
    setQualityConfig(qualitySettings)
    setHasChanges(true)
    toast.success('Recording settings reset to defaults')
  }, [])

  // Memoized save handler
  const handleSave = useCallback(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({
      recording: recordingConfig,
      quality: qualityConfig
    }))
    setHasChanges(false)
    toast.success('Recording settings saved')
  }, [recordingConfig, qualityConfig])

  // Memoized storage percentage
  const storagePercentage = useMemo(() => {
    return Math.round((storageUsed / storageLimit) * 100)
  }, [storageUsed, storageLimit])

  // Memoized storage status
  const storageStatus = useMemo(() => {
    if (storagePercentage >= 90) return 'critical'
    if (storagePercentage >= 75) return 'warning'
    return 'normal'
  }, [storagePercentage])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Recording Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure recording preferences and quality settings
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
          placeholder="Search recording settings..."
          className="pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 w-full"
          delay={200}
        />
      </div>

      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span>Storage Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Recording Storage</p>
                <p className="text-xs text-gray-500">
                  {storageUsed} GB used of {storageLimit} GB
                </p>
              </div>
              <Badge 
                variant={storageStatus === 'critical' ? 'destructive' : storageStatus === 'warning' ? 'secondary' : 'default'}
              >
                {storagePercentage}% used
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageStatus === 'critical' ? 'bg-red-600' :
                  storageStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-600'
                }`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear Storage</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-600" />
            <span>Recording Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRecording.map((setting) => (
            <RecordingSettingItem
              key={setting.id}
              setting={setting}
              onToggle={handleRecordingToggle}
            />
          ))}
        </CardContent>
      </Card>

      {/* Quality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-green-600" />
            <span>Quality Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredQuality.map((setting) => (
            <QualitySettingItem
              key={setting.id}
              setting={setting}
              onValueChange={handleQualityChange}
            />
          ))}
        </CardContent>
      </Card>

      {/* Recording Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileVideo className="w-5 h-5 text-orange-600" />
            <span>Recording Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-xs text-gray-500">Total Recordings</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-xs text-gray-500">Hours Recorded</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-xs text-gray-500">This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
