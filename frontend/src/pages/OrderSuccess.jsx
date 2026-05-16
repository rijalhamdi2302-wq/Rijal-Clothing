import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
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
        Thank you. Your order is being reviewed. We'll reach out shortly.
      </p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <p className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Order Details</p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-bark">Order ID</span>
              <span className="font-mono text-xs">{order._id}</span>
            </div>
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
              <span className={`tag status-${order.status} text-xs`}>{order.status}</span>
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
          Amount: RM {order ? Number(order.total).toFixed(2) : '—'}
        </p>
      </div>

      <Link to="/" className="btn-primary">Continue Shopping</Link>
    </main>
  )
}
