'use client'

import { useState } from 'react'
import Image from 'next/image'
import SettingsHeader from '@/components/settings/SettingsHeader'
import { Button } from '@/components/ui/button'

type Integration = {
  id: string
  name: string
  logo: string
  connected: boolean
}

const initialIntegrations: Integration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    logo: '/logos/google-calendar.png',
    connected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '/logos/slack.png',
    connected: false
  },
  {
    id: 'webhook',
    name: 'Webhook (Zapier/Integromat)',
    logo: '/logos/webhook.png',
    connected: false
  },
  {
    id: 'hubspot',
    name: 'Hubspot CRM',
    logo: '/logos/hubspot.png',
    connected: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '/logos/salesforce.png',
    connected: false
  }
]

export default function IntegrationSettings() {
  const [search, setSearch] = useState('')
  const [integrations, setIntegrations] = useState(initialIntegrations)

  const toggleConnection = (id: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    )
  }

  const filtered = integrations.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-sm text-gray-800">
      <SettingsHeader search={search} setSearch={setSearch} />

      <section className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold">App Integrations</h2>
        <p className="text-sm text-gray-600">
          Manage third-party tools connected to your Meet account.
        </p>

        <div className="mt-4 divide-y">
          {filtered.map(integration => (
            <div
              key={integration.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src={integration.logo}
                    alt={integration.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-medium">{integration.name}</span>
              </div>

              <Button
                variant="outline"
                onClick={() => toggleConnection(integration.id)}
                className={`text-sm ${
                  integration.connected
                    ? 'border-red-500 text-red-500 hover:bg-red-50'
                    : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                {integration.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-gray-400 text-sm pt-4">
              No integrations match your search.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
