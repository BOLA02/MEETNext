'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Plus } from 'lucide-react'

// --- SVG Icon Components ---
// Using inline SVGs to ensure they are always available and avoid 404 errors.
const GoogleCalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 3C4.67 3 4 3.67 4 4.5V27.5C4 28.33 4.67 29 5.5 29h21c.83 0 1.5-.67 1.5-1.5V4.5C28 3.67 27.33 3 26.5 3H5.5z" fill="#FFF"/>
    <path d="M4 10h24V4.5C28 3.67 27.33 3 26.5 3h-21C4.67 3 4 3.67 4 4.5V10z" fill="#4285F4"/>
    <rect x="9" y="3" width="2" height="3" fill="#FFF"/>
    <rect x="21" y="3" width="2" height="3" fill="#FFF"/>
    <text x="16" y="22" fontSize="14" fontFamily="Roboto, Arial, sans-serif" fontWeight="500" fill="#4285F4" textAnchor="middle">31</text>
  </svg>
)

const OutlookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#0072C6" d="M20.9 4.3H8.8c-.4 0-.8.2-1.1.4L1 11.2v9.3c0 .8.7 1.5 1.5 1.5h16.9c.8 0 1.5-.7 1.5-1.5V5.8c0-.8-.7-1.5-1.5-1.5zM8.8 6.3h12.1c.2 0 .4.2.4.4v.7L12 13.9 2.5 7.4V5.8c0-.8.7-1.5 1.5-1.5h4.8c-.1 0-.1.1 0 .1zM3.1 12.8l5.7 4.2c.5.3 1.1.3 1.6 0l5.7-4.2V19H3.1v-6.2z"/>
        <path fill="#0072C6" d="M6.5 8.3H3.2c-.3 0-.5-.1-.7-.3L1 6.5l6.3 4.6c-1-.5-2.1-1.1-3.2-1.8z"/>
    </svg>
)

const ZohoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#F04832" d="M21.5 2.5H2.5A.5.5 0 0 0 2 3v18a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5z"/>
        <path fill="#fff" d="M11.4 11.3c0-1.8-1.5-3.3-3.3-3.3s-3.3 1.5-3.3 3.3c0 1.8 1.5 3.3 3.3 3.3s3.3-1.5 3.3-3.3zm-1.8.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM19.3 8h-3.6c0 1.8-1.5 3.3-3.3 3.3s-3.3-1.5-3.3-3.3H5.5v7.2h1.8v-2.3c.7.8 1.8 1.4 3 1.4 1.8 0 3.3-1.5 3.3-3.3 0-.6-.2-1.2-.5-1.7h.5c1.8 0 3.3-1.5 3.3-3.3zm-1.8.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
    </svg>
)

const WebhookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 7c0-2.5-3.5-5-3.5-5s-3.5 2.5-3.5 5c0 2.454.793 4.583 2 6.226V22h3v-8.774c1.207-1.643 2-3.772 2-6.226z"/>
    <path d="M14.5 7A2.5 2.5 0 0 0 12 4.5a2.5 2.5 0 0 0-2.5 2.5"/>
    <path d="M6 14.275V22h3v-7.725A6.002 6.002 0 0 1 7 8c0-2.5-3.5-5-3.5-5S0 5.5 0 8a5.992 5.992 0 0 0 1.5 4H6"/>
  </svg>
)

// --- Data ---
type Integration = {
  id: string;
  name: string;
  icon: React.ComponentType;
  connected: boolean;
};

type IntegrationCategory = {
  title: string;
  items: Integration[];
};

const initialIntegrations: IntegrationCategory[] = [
  {
    title: 'Calendar Sync',
    items: [
      { id: 'google-calendar', name: 'Google Calendar', icon: GoogleCalendarIcon, connected: false },
      { id: 'outlook', name: 'Outlook', icon: OutlookIcon, connected: true },
    ],
  },
  {
    title: 'Social Media & CRM',
    items: [
      { id: 'zoho-social', name: 'Zoho Social', icon: ZohoIcon, connected: false },
      { id: 'zoho-crm', name: 'Zoho CRM', icon: ZohoIcon, connected: false },
    ],
  },
  {
    title: 'API & Webhooks',
    items: [
        { id: 'webhook', name: 'API & Webhooks', icon: WebhookIcon, connected: false }
    ],
  },
];

// --- Components ---
const IntegrationRow = ({ integration, onToggle }: { integration: Integration; onToggle: (id: string) => void; }) => {
  const Icon = integration.icon;
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Icon />
        <span className="text-sm font-medium text-gray-800">{integration.name}</span>
      </div>
      <button
        onClick={() => onToggle(integration.id)}
        className={`px-4 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
          integration.connected
            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {integration.connected ? (
          <>
            <Check size={16} className="text-green-600" />
            Connected
          </>
        ) : (
          <>
            <Plus size={16} />
            Connect
          </>
        )}
      </button>
    </div>
  );
};

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const handleToggle = (id: string) => {
    setIntegrations(
      integrations.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === id ? { ...item, connected: !item.connected } : item
        ),
      }))
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900">Integration</h1>
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        {integrations.map((category, index) => (
          <div key={category.title}>
            <h2 className="text-base font-semibold text-gray-500">{category.title}</h2>
            <div className="mt-2 divide-y divide-gray-200">
              {category.items.map(item => (
                <IntegrationRow key={item.id} integration={item} onToggle={handleToggle} />
              ))}
            </div>
            {index < integrations.length - 1 && <hr className="my-6 border-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}