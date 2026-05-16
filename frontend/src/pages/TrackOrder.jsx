import React, { useState } from 'react'
import { Search, Package, CheckCircle, Truck, Clock, XCircle, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Received',  icon: Clock,        desc: 'We received your order and payment slip. Verifying now.' },
  { key: 'confirmed', label: 'Payment Confirmed',icon: CheckCircle,  desc: 'Payment verified. Your order is being packed.' },
  { key: 'shipped',   label: 'Out for Delivery', icon: Truck,        desc: 'Your order is on its way to you.' },
  { key: 'delivered', label: 'Delivered',         icon: Package,      desc: 'Order delivered. Enjoy your purchase!' },
]

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const track = async () => {
    const cleaned = orderId.trim()
    if (!cleaned) return setError('Please enter your Order ID')
    setError('')
    setLoading(true)
    setOrder(null)
    try {
      const res = await api.get(`/orders/${cleaned}`)
      setOrder(res.data)
    } catch (e) {
      setError('Order not found. Please check your Order ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order
    ? order.status === 'cancelled'
      ? -1
      : STATUS_STEPS.findIndex(s => s.key === order.status)
    : -1

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10 fade-up">
        <Link to="/" className="font-display font-bold text-2xl text-ink">
          RIJAL<span className="text-rust">.</span>
        </Link>
        <h1 className="font-display text-3xl font-bold mt-4 mb-2">Track Your Order</h1>
        <p className="font-accent italic text-bark text-base">
          Enter your Order ID to check your delivery status
        </p>
      </div>

      {/* Search */}
      <div className="card p-6 mb-6 fade-up delay-1">
        <label className="field-label mb-2 block">Order ID</label>
        <p className="text-xs text-bark/60 font-body mb-3 italic">
          Found in your order confirmation page after checkout
        </p>
        <div className="flex gap-2">
          <input
            className="field flex-1"
            placeholder="e.g. 664f3a2b1c9d4e0012ab3456"
            value={orderId}
            onChange={e => { setOrderId(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && track()}
          />
          <button
            onClick={track}
            disabled={loading}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Search size={14} />
            {loading ? '...' : 'Track'}
          </button>
        </div>
        {error && (
          <p className="text-rust text-sm font-body mt-3 flex items-center gap-2">
            <XCircle size={14} /> {error}
          </p>
        )}
      </div>

      {/* Result */}
      {order && (
        <div className="space-y-4 fade-up">

          {/* Status Banner */}
          {order.status === 'cancelled' ? (
            <div className="card p-5 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <XCircle size={24} className="text-red-400 shrink-0" />
                <div>
                  <p className="font-greek text-xs text-red-400 uppercase tracking-widest">Cancelled</p>
                  <p className="font-display text-lg font-semibold text-red-700">Order Cancelled</p>
                  <p className="text-sm text-red-500 font-body mt-0.5">
                    This order has been cancelled. Contact us for help.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5">
              <p className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Delivery Progress</p>

              {/* Step tracker */}
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-sand" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-rust transition-all duration-700"
                  style={{
                    height: currentStepIndex <= 0 ? '0%' :
                            `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                  }}
                />

                <div className="space-y-6 relative">
                  {STATUS_STEPS.map((step, i) => {
                    const Icon = step.icon
                    const done = i <= currentStepIndex
                    const active = i === currentStepIndex

                    return (
                      <div key={step.key} className="flex items-start gap-4 pl-1">
                        {/* Circle */}
                        <div className={`
                          w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all
                          ${done
                            ? 'bg-rust border-rust text-white'
                            : 'bg-cream border-sand text-bark/30'
                          }
                          ${active ? 'ring-4 ring-rust/20' : ''}
                        `}>
                          <Icon size={15} />
                        </div>

                        {/* Text */}
                        <div className="pt-1.5">
                          <p className={`font-display font-semibold text-base leading-tight ${done ? 'text-ink' : 'text-bark/40'}`}>
                            {step.label}
                          </p>
                          {active && (
                            <p className="text-bark text-sm font-body mt-0.5">{step.desc}</p>
                          )}
                          {done && !active && (
                            <p className="text-sage text-xs font-mono mt-0.5">✓ Completed</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="card p-5">
            <p className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Order Summary</p>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-bark">Order ID</span>
                <span className="font-mono text-xs text-ink">{order._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bark">Name</span>
                <span className="font-medium">{order.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bark">Order Date</span>
                <span className="font-mono text-xs">{new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bark">Total Paid</span>
                <span className="font-mono font-bold text-rust">RM {Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            <div className="divider" />

            {/* Items */}
            <p className="font-mono text-xs text-bark uppercase tracking-wider mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-bark">{item.name} ({item.size}) ×{item.qty}</span>
                  <span className="font-mono text-xs">RM {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Delivery address */}
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-bark/50 mt-0.5 shrink-0" />
              <p className="text-sm text-bark/70 font-body">
                {order.address}, {order.city}, {order.postcode} {order.state}
              </p>
            </div>
          </div>

          {/* Help */}
          <div className="text-center py-2">
            <p className="text-xs text-bark/40 font-body italic">
              Questions about your order? Contact us via WhatsApp or Instagram.
            </p>
          </div>
        </div>
      )}

      {/* Back to shop */}
      <div className="text-center mt-8">
        <Link to="/" className="nav-link text-bark/40 hover:text-bark">
          ← Back to Shop
        </Link>
      </div>
    </main>
  )
}
