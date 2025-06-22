'use client'

import { usePathname, useRouter } from 'next/navigation'
import { memo, useMemo, useCallback } from 'react'
import {
  Settings,
  Calendar,
  Sparkles,
  Bell,
  Lock,
  Video,
  Shield,
  Keyboard,
  Accessibility,
  User,
  ChevronRight,
  Crown
} from 'lucide-react'
import { usePerformanceMonitor } from './PerformanceOptimizer'

const items = [
  { 
    label: 'General', 
    icon: Settings, 
    href: '/settings/general',
    description: 'Profile, language, and basic settings'
  },
  { 
    label: 'Events', 
    icon: Calendar, 
    href: '/settings/events',
    description: 'Meeting preferences and templates'
  },
  { 
    label: 'AI Features', 
    icon: Sparkles, 
    href: '/settings/ai-features',
    description: 'AI-powered enhancements',
    premium: true
  },
  { 
    label: 'Notifications', 
    icon: Bell, 
    href: '/settings/notification',
    description: 'Email and push notifications'
  },
  { 
    label: 'Security & Privacy', 
    icon: Lock, 
    href: '/settings/security-&-privacy',
    description: 'Account security and data privacy'
  },
  { 
    label: 'Recording', 
    icon: Video, 
    href: '/settings/recording',
    description: 'Meeting recording settings'
  },
  { 
    label: 'Integrations', 
    icon: Shield, 
    href: '/settings/integration',
    description: 'Third-party app connections'
  },
  { 
    label: 'Keyboard Shortcuts', 
    icon: Keyboard, 
    href: '/settings/keyboard-shortcuts',
    description: 'Custom keyboard shortcuts'
  },
  { 
    label: 'Accessibility', 
    icon: Accessibility, 
    href: '/settings/accessibility',
    description: 'Accessibility and usability options'
  }
]

// Mock user data - replace with actual user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/avatars/user.jpg',
  plan: 'Pro',
  planExpiry: '2024-12-31'
}

const SettingsSidebar = memo(() => {
  const router = useRouter()
  const pathname = usePathname()
  const { renderCount } = usePerformanceMonitor('SettingsSidebar')

  // Memoized navigation handler
  const handleNavigation = useCallback((href: string) => {
    router.push(href)
  }, [router])

  // Memoized active state check
  const isActive = useCallback((href: string) => {
    return pathname === href
  }, [pathname])

  // Memoized user profile section
  const userProfile = useMemo(() => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userData.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {userData.email}
          </p>
        </div>
      </div>
      
      {/* Plan indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Crown className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-medium text-gray-700">
            {userData.plan} Plan
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Expires {new Date(userData.planExpiry).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })}
        </span>
      </div>
    </div>
  ), [])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-purple-600">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      {/* User Profile */}
      {userProfile}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ label, icon: Icon, href, description, premium }) => {
          const active = isActive(href)

          return (
            <button
              key={label}
              onClick={() => handleNavigation(href)}
              className={`group flex items-center justify-between w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active 
                  ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${
                  active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span>{label}</span>
                    {premium && (
                      <Crown className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${
                    active ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {description}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                active ? 'text-purple-600 rotate-90' : 'text-gray-300 group-hover:text-gray-400'
              }`} />
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Meet v1.0.0</p>
          <p className="mt-1">Need help? Contact support</p>
        </div>
      </div>
    </div>
  )
})

SettingsSidebar.displayName = 'SettingsSidebar'

export default SettingsSidebar
