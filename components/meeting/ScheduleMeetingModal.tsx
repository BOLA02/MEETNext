// components/meetings/ScheduleMeetingModal.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import StepOne from "./steps/StepOne"
import StepTwo from "./steps/StepTwo"
import StepThree from "./steps/StepThree"

const steps = ['Details', 'Ticketing and pricing', 'Branding and customization']

export default function ScheduleMeetingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[720px] p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex justify-between border-b pb-2 mb-6">
                {steps.map((label, index) => (
                    <button
                    key={label}
                    onClick={() => setStep(index)}
                    className="flex-1 text-center text-sm font-medium focus:outline-none px-4"
                    >
                    <div className={index === step ? 'text-purple-700' : 'text-purple-400'}>
                        {label}
                    </div>
                    <div
                        className={`h-1 mt-1 rounded-full transition-all duration-200 ${
                        index === step ? 'bg-purple-700' : 'bg-purple-200'
                        }`}
                    />
                    </button>
                ))}
        </div>

        {/* Step Content */}
        {step === 0 && <StepOne />}
        {step === 1 && <StepTwo />}
        {step === 2 && <StepThree />}

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 rounded border text-sm disabled:opacity-50"
          >
            Back
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-gray-300"
            >
              Cancel
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm rounded bg-emerald-700 text-white"
              >
                Next
              </button>
            ) : (
              <button
                className="px-4 py-2 text-sm rounded bg-emerald-700 text-white"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
