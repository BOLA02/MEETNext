'use client'

interface RadioOption {
  label: string
  value: string
}

interface SettingRadioGroupProps {
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export default function SettingRadioGroup({
  label,
  options,
  value,
  onChange
}: SettingRadioGroupProps) {
  return (
    <div className="py-2">
      <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
      <div className="space-y-2">
        {options.map(({ label, value: optionValue }) => (
          <label key={optionValue} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={label}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
              className="accent-purple-600"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}
