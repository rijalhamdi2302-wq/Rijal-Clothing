import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../utils/api'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => {})
  }, [id])

  if (!order) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="font-mono text-xs text-bark animate-pulse">Loading...</p>
    </div>
  )

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-ink text-cream px-4 h-12 flex items-center gap-4">
        <Link to="/admin" className="text-bark hover:text-cream transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="font-display font-bold text-lg">RIJAL<span className="text-rust">.</span></span>
        <span className="font-mono text-xs text-bark">ORDER DETAIL</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs text-bark mb-1">ORDER #{order._id.slice(-6).toUpperCase()}</p>
            <h1 className="font-display text-2xl font-bold">{order.name}</h1>
          </div>
          <span className={`tag status-${order.status} text-xs capitalize`}>{order.status}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="card p-5">
            <h2 className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <Row label="Name" val={order.name} />
              <Row label="Email" val={order.email} />
              <Row label="Phone" val={order.phone} />
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Delivery Address</h2>
            <div className="space-y-2 text-sm">
              <Row label="Street" val={order.address} />
              <Row label="City" val={order.city} />
              <Row label="Postcode" val={order.postcode} />
              <Row label="State" val={order.state} />
              {order.notes && <Row label="Notes" val={order.notes} />}
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-5">
            <h2 className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start border-b border-sand pb-2">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="font-mono text-xs text-bark/60">Size: {item.size} · Qty: {item.qty}</p>
                  </div>
                  <p className="font-mono text-sm text-rust">RM {item.subtotal.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span className="font-mono text-xs uppercase tracking-wider text-bark">Total</span>
                <span className="font-mono text-rust">RM {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Slip */}
          <div className="card p-5">
            <h2 className="font-mono text-xs text-bark uppercase tracking-wider mb-4">Payment Slip</h2>
            {order.slipUrl ? (
              <div>
                {order.slipUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  <img
                    src={`${apiBase}${order.slipUrl}`}
                    alt="Payment slip"
                    className="w-full max-h-64 object-contain border border-sand mb-3"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-cream border border-sand mb-3">
                    <span className="text-2xl">📄</span>
                    <span className="font-mono text-xs">PDF Payment Slip</span>
                  </div>
                )}
                <a
                  href={`${apiBase}${order.slipUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline text-xs py-1 w-full text-center block"
                >
                  Open Full Slip ↗
                </a>
              </div>
            ) : (
              <p className="font-mono text-xs text-bark/40 italic">No slip uploaded</p>
            )}
          </div>
        </div>

        <div className="mt-4 text-right">
          <p className="font-mono text-xs text-bark/40">
            Order placed: {new Date(order.createdAt).toLocaleString('en-MY')}
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, val }) {
  return (
    <div className="flex gap-2">
      <span className="text-bark/60 shrink-0 w-20">{label}</span>
      <span className="text-ink font-medium">{val}</span>
    </div>
  )
}
