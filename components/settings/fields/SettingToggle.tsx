'use client'

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SettingToggleProps {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}

export default function SettingToggle({ label, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <Label className="text-sm text-gray-800">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
