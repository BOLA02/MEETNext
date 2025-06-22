'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Search, Zap, Brain, Clock, Users, BarChart3, Save, RotateCcw, Download, Upload, AlertTriangle, Crown, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { DebouncedInput, OptimizedList, usePerformanceMonitor } from '@/components/PerformanceOptimizer'

const features = [
  {
    category: 'Smart Scheduling Suggestions',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    items: [
      {
        id: 'recommend-time',
        label: 'AI recommends the best time based on attendee availability',
        description: 'Automatically suggests optimal meeting times by analyzing participant calendars',
        checked: true,
      },
      {
        id: 'auto-adjust-timezone',
        label: 'Auto-adjust time zones for global audiences',
        description: 'Intelligently converts meeting times for participants in different time zones',
        checked: true,
      },
      {
        id: 'conflict-detection',
        label: 'Detect and resolve scheduling conflicts',
        description: 'AI identifies potential conflicts and suggests alternative times',
        checked: false,
      },
    ],
  },
  {
    category: 'Auto-Generated Event Descriptions',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    items: [
      {
        id: 'ai-descriptions',
        label: 'AI drafts descriptions based on event details',
        description: 'Generate professional event descriptions from basic information',
        checked: true,
      },
      {
        id: 'smart-tags',
        label: 'Auto-generate relevant tags and categories',
        description: 'Automatically tag events with appropriate categories for better organization',
        checked: true,
      },
      {
        id: 'content-suggestions',
        label: 'Suggest agenda items and topics',
        description: 'AI-powered suggestions for meeting agendas based on event type',
        checked: false,
      },
    ],
  },
  {
    category: 'Live AI Summaries & Transcripts',
    icon: Zap,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    items: [
      {
        id: 'realtime-captions',
        label: 'Real-time captions and post-event transcription options',
        description: 'Live closed captions and automatic meeting transcription',
        checked: true,
      },
      {
        id: 'smart-summaries',
        label: 'AI-generated meeting summaries with key points',
        description: 'Automatic extraction of key discussion points and action items',
        checked: true,
      },
      {
        id: 'speaker-identification',
        label: 'Identify and label different speakers',
        description: 'Automatically distinguish between different participants in transcripts',
        checked: false,
      },
    ],
  },
  {
    category: 'Engagement Analytics',
    icon: BarChart3,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    items: [
      {
        id: 'ai-analytics',
        label: 'AI analyzes attendee participation and provides engagement scores',
        description: 'Track and measure participant engagement during meetings',
        checked: true,
      },
      {
        id: 'sentiment-analysis',
        label: 'Real-time sentiment analysis of meeting discussions',
        description: 'Monitor the mood and tone of conversations in real-time',
        checked: false,
      },
      {
        id: 'participation-insights',
        label: 'Detailed participation insights and recommendations',
        description: 'Get insights on who is participating and suggestions for improvement',
        checked: true,
      },
    ],
  },
  {
    category: 'Advanced AI Features',
    icon: Sparkles,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    premium: true,
    items: [
      {
        id: 'voice-cloning',
        label: 'AI voice cloning for personalized announcements',
        description: 'Create custom voice announcements using AI voice synthesis',
        checked: false,
      },
      {
        id: 'smart-backgrounds',
        label: 'AI-generated virtual backgrounds',
        description: 'Automatically generate professional virtual backgrounds',
        checked: false,
      },
      {
        id: 'language-translation',
        label: 'Real-time language translation for global meetings',
        description: 'Translate speech and text in real-time for international participants',
        checked: false,
      },
    ],
  },
]

const LS_KEY = 'ai_features_settings_v1'

// Memoized feature item component
const FeatureItem = memo(({ 
  item, 
  checked, 
  onCheckboxChange, 
  isPremium 
}: {
  item: any
  checked: boolean
  onCheckboxChange: (itemId: string, checked: boolean, isPremium: boolean) => void
  isPremium: boolean
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <Checkbox
      id={item.id}
      checked={checked}
      onCheckedChange={(checked) => onCheckboxChange(item.id, checked === true, isPremium)}
      className="mt-0.5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
      disabled={isPremium}
    />
    <div className="flex-1">
      <label
        htmlFor={item.id}
        className={`text-sm font-medium cursor-pointer block ${isPremium ? 'text-gray-400' : 'text-gray-900'}`}
      >
        {item.label}
      </label>
      <p className={`text-xs mt-1 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
        {item.description}
      </p>
    </div>
  </div>
))

// Memoized category header component
const CategoryHeader = memo(({ 
  section, 
  enabledInCategory, 
  onToggleAll 
}: {
  section: any
  enabledInCategory: number
  onToggleAll: (enable: boolean) => void
}) => {
  const IconComponent = section.icon
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${section.bgColor}`}>
          <IconComponent className={`w-5 h-5 ${section.color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {section.category}
            {section.premium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500">
            {enabledInCategory} of {section.items.length} features enabled
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleAll(true)}
          className="text-xs"
          disabled={section.premium}
        >
          Enable All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleAll(false)}
          className="text-xs"
          disabled={section.premium}
        >
          Disable All
        </Button>
      </div>
    </div>
  )
})

// Memoized feature category component
const FeatureCategory = memo(({ 
  section, 
  checkedItems, 
  onCheckboxChange, 
  onToggleAll 
}: {
  section: any
  checkedItems: Record<string, boolean>
  onCheckboxChange: (itemId: string, checked: boolean, isPremium: boolean) => void
  onToggleAll: (enable: boolean) => void
}) => {
  const enabledInCategory = useMemo(() => 
    section.items.filter((item: any) => checkedItems[item.id]).length, 
    [section.items, checkedItems]
  )

  return (
    <Card className={`border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow relative ${section.premium ? 'overflow-hidden' : ''}`}>
      {section.premium && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-8 h-8 text-yellow-600" />
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Unlock advanced AI capabilities with our premium plan
            </p>
            <Button
              onClick={() => onToggleAll(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        <CategoryHeader 
          section={section} 
          enabledInCategory={enabledInCategory} 
          onToggleAll={onToggleAll}
        />
        
        <OptimizedList
          items={section.items}
          renderItem={(item: any) => (
            <FeatureItem
              item={item}
              checked={checkedItems[item.id] || false}
              onCheckboxChange={onCheckboxChange}
              isPremium={section.premium}
            />
          )}
          keyExtractor={(item: any) => item.id}
          className="space-y-4"
        />
      </CardContent>
    </Card>
  )
})

export default function AIFeaturesSettings() {
  const { renderCount } = usePerformanceMonitor('AIFeaturesSettings')
  
  const [search, setSearch] = useState('')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      setCheckedItems(JSON.parse(saved))
    } else {
      // Initialize with default values
    const initial: Record<string, boolean> = {}
    features.forEach(category => {
      category.items.forEach(item => {
        initial[item.id] = item.checked
      })
    })
      setCheckedItems(initial)
    }
  }, [])

  // Save settings to localStorage with debouncing
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(checkedItems))
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [checkedItems])

  const handleCheckboxChange = useCallback((itemId: string, checked: boolean, isPremium: boolean = false) => {
    if (isPremium) {
      setShowPremiumDialog(true)
      return
    }
    
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }))
    toast.success(`${checked ? 'Enabled' : 'Disabled'} AI feature`)
  }, [])

  const resetToDefaults = useCallback(() => {
    setShowResetDialog(true)
  }, [])

  const confirmReset = useCallback(() => {
    const initial: Record<string, boolean> = {}
    features.forEach(category => {
      category.items.forEach(item => {
        initial[item.id] = item.checked
      })
    })
    setCheckedItems(initial)
    setShowResetDialog(false)
    toast.success('AI features reset to defaults')
  }, [])

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(checkedItems, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ai-features-settings.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('AI features settings exported')
  }, [checkedItems])

  const importSettings = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target.result as string)
            setCheckedItems(importedSettings)
            toast.success('AI features settings imported')
          } catch (error) {
            toast.error('Invalid settings file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const toggleAllInCategory = useCallback((category: typeof features[0], enable: boolean) => {
    if (category.premium) {
      setShowPremiumDialog(true)
      return
    }
    
    const updates: Record<string, boolean> = {}
    category.items.forEach(item => {
      updates[item.id] = enable
    })
    setCheckedItems(prev => ({ ...prev, ...updates }))
    toast.success(`${enable ? 'Enabled' : 'Disabled'} all ${category.category} features`)
  }, [])

  // Memoized filtered features
  const filteredFeatures = useMemo(() => 
    features.filter(({ category, items }) => {
    const query = search.toLowerCase()
    return (
      category.toLowerCase().includes(query) ||
        items.some((item) => 
          item.label.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
        )
      )
    }), 
    [search]
  )

  // Memoized counts
  const enabledCount = useMemo(() => 
    Object.values(checkedItems).filter(Boolean).length, 
    [checkedItems]
  )
  const totalCount = useMemo(() => 
    features.reduce((sum, category) => sum + category.items.length, 0), 
    []
  )

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">AI Features</h1>
          <p className="text-gray-600 mt-1">
            {enabledCount} of {totalCount} features enabled
          </p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <DebouncedInput
            value={search}
            onChange={setSearch}
            placeholder="Search AI features..."
            className="pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 w-full"
            delay={200}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Features
        </Button>
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button
          onClick={exportSettings}
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Settings
        </Button>
        <Button
          onClick={importSettings}
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Settings
        </Button>
      </div>

      {/* AI Features Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Enhancements</h2>
        </div>

            {filteredFeatures.length > 0 ? (
          <OptimizedList
            items={filteredFeatures}
            renderItem={(section: any) => (
              <FeatureCategory
                section={section}
                checkedItems={checkedItems}
                onCheckboxChange={handleCheckboxChange}
                onToggleAll={(enable) => toggleAllInCategory(section, enable)}
              />
            )}
            keyExtractor={(section: any) => section.category}
            className="space-y-6"
          />
        ) : (
          <Card className="border border-gray-200 bg-white shadow">
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                No AI features matched your search.
              </p>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Advanced Features Toggle */}
      {showAdvanced && (
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Advanced AI Features</h3>
          <p className="text-sm text-purple-700">
            These experimental features use cutting-edge AI technology. Enable at your own discretion.
          </p>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reset AI Features</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to reset all AI features to their default settings? 
              This will disable all custom configurations you've made.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReset}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade Dialog */}
      {showPremiumDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Premium Feature</h3>
                <p className="text-sm text-gray-600">Upgrade to unlock advanced AI</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Premium AI Features Include:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  AI Voice Cloning
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Smart Virtual Backgrounds
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Real-time Language Translation
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPremiumDialog(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setShowPremiumDialog(false)
                  toast.success('Redirecting to premium upgrade...')
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}