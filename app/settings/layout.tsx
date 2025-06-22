import { ReactNode } from 'react'
import SettingsSidebar from '@/components/SettingsSidebar'
import { memo } from 'react'

// Memoized settings layout for better performance
const SettingsLayout = memo(({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
        <SettingsSidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
})

SettingsLayout.displayName = 'SettingsLayout'

export default SettingsLayout
