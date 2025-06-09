import { ReactNode } from 'react'
import SettingsSidebar from '@/components/SettingsSidebar'

// ✅ This overrides the dashboard layout completely
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-[250px] bg-white border-r">
        <SettingsSidebar />
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
