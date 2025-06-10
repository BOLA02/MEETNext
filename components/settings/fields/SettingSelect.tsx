'use client'

interface SettingSelectProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function SettingSelect({ label, options, value, onChange }: SettingSelectProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <label className="text-sm text-gray-800">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
