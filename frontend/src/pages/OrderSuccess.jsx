import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Search } from 'lucide-react'
import api from '../utils/api'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => {})
  }, [orderId])

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center fade-up">
      <CheckCircle size={56} className="mx-auto text-sage mb-6" />
      <h1 className="font-display text-4xl font-bold mb-3">Order Placed!</h1>
      <p className="font-accent italic text-bark text-lg mb-8">
        Thank you. Your order is being reviewed. We'll process it shortly.
      </p>

      {/* Track Order CTA — most important */}
      <div className="card p-5 mb-6 bg-ink text-cream border-0">
        <p className="font-mono text-xs text-bark tracking-widest uppercase mb-2">Save This</p>
        <p className="font-display text-lg font-semibold text-cream mb-1">Your Order ID</p>
        <p className="font-mono text-rust text-sm break-all mb-4 bg-charcoal px-3 py-2 select-all">
          {orderId}
        </p>
        <p className="text-sand/60 text-xs font-body mb-4">
          Use this ID to track your order status anytime
        </p>
        <Link
          to={`/track/${orderId}`}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Search size={14} /> Track My Order
        </Link>
      </div>

      {order && (
        <div className="card p-6 text-left mb-6">
          <p className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Order Details</p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-bark">Name</span>
              <span>{order.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bark">Total</span>
              <span className="font-mono text-rust font-bold">RM {Number(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bark">Status</span>
              <span className={`tag status-${order.status} text-xs capitalize`}>{order.status}</span>
            </div>
          </div>

          <div className="divider" />

          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span className="text-bark">{item.name} ({item.size}) ×{item.qty}</span>
              <span className="font-mono text-xs">RM {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-charcoal text-cream p-4 mb-8 text-left">
        <p className="font-mono text-xs text-bark mb-2">Payment reminder</p>
        <p className="font-mono text-xs text-sand leading-relaxed">
          Maybank · 1234 5678 9012 · RIJAL BIN HAMDI<br />
          Amount: <span className="text-rust">RM {order ? Number(order.total).toFixed(2) : '—'}</span>
        </p>
      </div>

      <Link to="/" className="btn-outline">Continue Shopping</Link>
    </main>
  )
}
