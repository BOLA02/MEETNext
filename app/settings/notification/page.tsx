'use client'

import { useState, useEffect, createElement } from 'react'
import { initialSections } from './data'
import type { NotificationItem, NotificationSection } from './data'
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
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Moon,
  Sun
} from 'lucide-react'

function NotificationSettingsPage() {
  const [sections, setSections] = useState<NotificationSection[]>(initialSections)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)
  const [globalSettings, setGlobalSettings] = useState({
    enableAll: true,
    disableAll: false,
    sound: true,
    previews: true,
  })
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    from: '22:00',
    to: '08:00',
    weekendsOnly: false
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings')
    if (savedSettings) {
      setSections(JSON.parse(savedSettings))
    }
  }, [])

  const handleToggle = (itemId: string) => {
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }))
    )
  }
  
  const handleSave = () => {
    localStorage.setItem('notification_settings', JSON.stringify(sections))
    alert('Settings saved!')
  }

  const handleReset = () => {
    setSections(initialSections)
    setShowResetModal(false)
  }

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notification Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage how you receive notifications from us.
          </p>
        </header>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm mb-8 p-6">
            <div className="flex items-center mb-4">
              {createElement(section.icon, { className: "w-6 h-6 text-blue-600" })}
              <h2 className="text-xl font-semibold text-gray-700 ml-3">{section.title}</h2>
            </div>
            <p className="text-gray-500 mb-6">{section.description}</p>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(item.id)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${item.checked ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform ${item.checked ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={() => setShowResetModal(true)}
            className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            <RotateCcw className="inline w-4 h-4 mr-2" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="inline w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettingsPage
