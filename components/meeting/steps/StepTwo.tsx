'use client'

import { useState } from 'react'

export default function StepTwo() {
  const [ticketType, setTicketType] = useState('Free')
  const [ticketFormat, setTicketFormat] = useState('E-ticket')
  const [country, setCountry] = useState('United States')
  const [currency, setCurrency] = useState('USD')
  const [prices, setPrices] = useState({
    regular: '100.00',
    vip: '170.00',
    vvip: '220.00',
  })
  const [quantity, setQuantity] = useState('100000')
  const [discountCode, setDiscountCode] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [creditInfo, setCreditInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    code: '',
  })

  return (
    <div className="space-y-6">
      {/* Ticket Type & Format */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Ticket Type</label>
          <div className="flex gap-4">
            {['Free', 'Paid', 'Donation based'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={ticketType === type}
                  onChange={() => setTicketType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Ticket Format</label>
          <div className="flex gap-4">
            {['Physical', 'E-ticket'].map((format) => (
              <label key={format} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={format}
                  checked={ticketFormat === format}
                  onChange={() => setTicketFormat(format)}
                />
                {format}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Country & Currency */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option>United States</option>
            <option>Nigeria</option>
            <option>Ghana</option>
            <option>Canada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="USD">U.S. Dollar (USD)</option>
            <option value="NGN">Naira (NGN)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
          </select>
        </div>
      </div>

      {/* Price Tiers */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Regular Price</label>
          <input
            type="text"
            value={prices.regular}
            onChange={(e) => setPrices({ ...prices, regular: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">VIP Price</label>
          <input
            type="text"
            value={prices.vip}
            onChange={(e) => setPrices({ ...prices, vip: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">VVIP Price</label>
          <input
            type="text"
            value={prices.vvip}
            onChange={(e) => setPrices({ ...prices, vvip: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Quantity & Discount */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Ticket Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={discountCode}
            onChange={() => setDiscountCode(!discountCode)}
            className="mr-2"
          />
          <label className="text-sm">Create discount codes for attendees</label>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold mb-1">Choose payment method</label>
        <div className="space-y-2">
          {['Stripe payment', 'Paypal', 'Credit Card'].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {/* Credit Card Fields */}
      {paymentMethod === 'Credit Card' && (
        <div className="grid grid-cols-2 gap-4 border p-4 rounded">
          <div>
            <label className="block text-sm font-medium mb-1">Name on card</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={creditInfo.name}
              onChange={(e) => setCreditInfo({ ...creditInfo, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Card number</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={creditInfo.number}
              onChange={(e) => setCreditInfo({ ...creditInfo, number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiration date</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={creditInfo.expiry}
              onChange={(e) => setCreditInfo({ ...creditInfo, expiry: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Card code</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={creditInfo.code}
              onChange={(e) => setCreditInfo({ ...creditInfo, code: e.target.value })}
            />
          </div>
          <div className="col-span-2 mt-2 flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm">Save card info for future use</label>
          </div>
        </div>
      )}
    </div>
  )
}
