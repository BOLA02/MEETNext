'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Key, 
  Search,
  Save,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { DebouncedInput, usePerformanceMonitor } from '@/components/PerformanceOptimizer'

type SecuritySetting = {
  id: string
  label: string
  description: string
  enabled: boolean
  category: 'authentication' | 'privacy' | 'data' | 'sessions'
  critical?: boolean
}

type PrivacySetting = {
  id: string
  label: string
  description: string
  enabled: boolean
  category: 'data-sharing' | 'analytics' | 'marketing' | 'third-party'
}

const securitySettings: SecuritySetting[] = [
  {
    id: 'two-factor-auth',
    label: 'Two-Factor Authentication',
    description: 'Add an extra layer of security with 2FA',
    enabled: false,
    category: 'authentication',
    critical: true
  },
  {
    id: 'password-requirements',
    label: 'Strong Password Requirements',
    description: 'Enforce complex password policies',
    enabled: true,
    category: 'authentication'
  },
  {
    id: 'login-notifications',
    label: 'Login Notifications',
    description: 'Get notified of new login attempts',
    enabled: true,
    category: 'authentication'
  },
  {
    id: 'session-timeout',
    label: 'Automatic Session Timeout',
    description: 'Automatically log out after inactivity',
    enabled: true,
    category: 'sessions'
  },
  {
    id: 'device-approval',
    label: 'Device Approval',
    description: 'Require approval for new devices',
    enabled: false,
    category: 'authentication'
  },
  {
    id: 'ip-restrictions',
    label: 'IP Address Restrictions',
    description: 'Limit access to specific IP addresses',
    enabled: false,
    category: 'authentication'
  }
]

const privacySettings: PrivacySetting[] = [
  {
    id: 'data-analytics',
    label: 'Usage Analytics',
    description: 'Help improve Meet by sharing usage data',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'marketing-emails',
    label: 'Marketing Communications',
    description: 'Receive product updates and promotional emails',
    enabled: false,
    category: 'marketing'
  },
  {
    id: 'third-party-sharing',
    label: 'Third-Party Data Sharing',
    description: 'Allow sharing data with trusted partners',
    enabled: false,
    category: 'third-party'
  },
  {
    id: 'public-profile',
    label: 'Public Profile Visibility',
    description: 'Make your profile visible to other users',
    enabled: true,
    category: 'data-sharing'
  }
]

const LS_KEY = 'security_privacy_settings_v1'

// Memoized security setting component
const SecuritySettingItem = memo(({ 
  setting, 
  onToggle 
}: {
  setting: SecuritySetting
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

SecuritySettingItem.displayName = 'SecuritySettingItem'

// Memoized privacy setting component
const PrivacySettingItem = memo(({ 
  setting, 
  onToggle 
}: {
  setting: PrivacySetting
  onToggle: (id: string) => void
}) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
    <div className="flex-1">
      <Label className="text-sm font-medium cursor-pointer">
        {setting.label}
      </Label>
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

PrivacySettingItem.displayName = 'PrivacySettingItem'

export default function SecurityPrivacySettings() {
  const { renderCount } = usePerformanceMonitor('SecurityPrivacySettings')
  
  const [search, setSearch] = useState('')
  const [securityConfig, setSecurityConfig] = useState<SecuritySetting[]>(securitySettings)
  const [privacyConfig, setPrivacyConfig] = useState<PrivacySetting[]>(privacySettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSecurityConfig(parsed.security || securitySettings)
        setPrivacyConfig(parsed.privacy || privacySettings)
      } catch (error) {
        console.error('Failed to load security settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage with debouncing
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(LS_KEY, JSON.stringify({
          security: securityConfig,
          privacy: privacyConfig
        }))
        setHasChanges(false)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [securityConfig, privacyConfig, hasChanges])

  // Memoized toggle handlers
  const handleSecurityToggle = useCallback((id: string) => {
    setSecurityConfig(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
    setHasChanges(true)
  }, [])

  const handlePrivacyToggle = useCallback((id: string) => {
    setPrivacyConfig(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
    setHasChanges(true)
  }, [])

  // Memoized filtered settings
  const filteredSecurity = useMemo(() => {
    if (!search.trim()) return securityConfig
    
    return securityConfig.filter(setting =>
      setting.label.toLowerCase().includes(search.toLowerCase()) ||
      setting.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [securityConfig, search])

  const filteredPrivacy = useMemo(() => {
    if (!search.trim()) return privacyConfig
    
    return privacyConfig.filter(setting =>
      setting.label.toLowerCase().includes(search.toLowerCase()) ||
      setting.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [privacyConfig, search])

  // Memoized password change handler
  const handlePasswordChange = useCallback(() => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    // Simulate password change
    setPasswordError('')
    toast.success('Password changed successfully')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }, [newPassword, confirmPassword])

  // Memoized reset handler
  const handleReset = useCallback(() => {
    setSecurityConfig(securitySettings)
    setPrivacyConfig(privacySettings)
    setHasChanges(true)
    toast.success('Settings reset to defaults')
  }, [])

  // Memoized save handler
  const handleSave = useCallback(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({
      security: securityConfig,
      privacy: privacyConfig
    }))
    setHasChanges(false)
    toast.success('Security settings saved')
  }, [securityConfig, privacyConfig])

  // Memoized security score
  const securityScore = useMemo(() => {
    const total = securityConfig.length
    const enabled = securityConfig.filter(s => s.enabled).length
    return Math.round((enabled / total) * 100)
  }, [securityConfig])

  // Add effect to shake the screen on password error
  useEffect(() => {
    if (passwordError) {
      document.body.classList.add('shake-screen');
      const timeout = setTimeout(() => {
        document.body.classList.remove('shake-screen');
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [passwordError]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Security & Privacy</h1>
          <p className="text-gray-600 mt-1">
            Manage your account security and privacy preferences
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
          placeholder="Search security settings..."
          className="pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 w-full"
          delay={200}
        />
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Security Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
                <div className="text-sm text-gray-500">Secure</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${securityScore}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {securityConfig.filter(s => s.enabled).length} of {securityConfig.length} enabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-purple-600" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredSecurity.length > 0 ? (
            filteredSecurity.map((setting) => (
              <SecuritySettingItem
                key={setting.id}
                setting={setting}
                onToggle={handleSecurityToggle}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No security settings found.</div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPrivacy.map((setting) => (
            <PrivacySettingItem
              key={setting.id}
              setting={setting}
              onToggle={handlePrivacyToggle}
            />
          ))}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className={passwordError ? 'shake' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-orange-600" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pr-10 ${passwordError && !currentPassword ? 'border-red-500 focus:ring-red-500 blink-red' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`pr-10 ${passwordError && (passwordError.includes('match') || passwordError.includes('least')) ? 'border-red-500 focus:ring-red-500 blink-red' : ''}`}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pr-10 ${passwordError && passwordError.includes('match') ? 'border-red-500 focus:ring-red-500 blink-red' : ''}`}
              />
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm font-semibold mt-1 blink-red">{passwordError}</div>
            )}
          </div>
          
          <Button 
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Change Password
          </Button>
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