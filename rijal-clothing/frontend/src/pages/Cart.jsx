import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, count } = useCart()

  if (cart.length === 0) return (
    <main className="max-w-6xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="mx-auto text-sand mb-4" />
      <h2 className="font-display text-2xl mb-2">Your bag is empty</h2>
      <p className="text-bark text-sm mb-6 font-accent italic">Looks like you haven't added anything yet.</p>
      <Link to="/" className="btn-primary">Continue Shopping</Link>
    </main>
  )

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2 fade-up">Your Bag</h1>
      <p className="font-mono text-xs text-bark mb-8">{count} item{count !== 1 ? 's' : ''}</p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item, i) => (
            <div key={`${item.id}-${item.size}`} className="card p-4 flex gap-4 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Visual */}
              <div
                className="w-20 h-20 shrink-0 flex items-center justify-center text-3xl"
                style={{ background: `${item.color}15` }}
              >
                {item.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-bark uppercase">{item.category}</p>
                    <h3 className="font-display font-semibold text-base leading-tight">{item.name}</h3>
                    <p className="font-mono text-xs text-bark/60 mt-0.5">Size: {item.size}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.size)} className="text-bark/40 hover:text-rust transition-colors shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.size, item.qty - 1)}>−</button>
                    <span className="font-mono text-xs w-6 text-center">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</button>
                  </div>
                  <p className="font-mono text-sm font-bold text-rust">RM {(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit fade-up delay-2">
          <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
          <div className="divider" />

          {cart.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm mb-2">
              <span className="text-bark font-body">{item.name} ×{item.qty}</span>
              <span className="font-mono text-xs">RM {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <div className="divider" />

          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-bark">Total</span>
            <span className="font-mono font-bold text-rust text-lg">RM {total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
            Checkout <ArrowRight size={14} />
          </Link>

          <Link to="/" className="btn-outline w-full mt-2 flex items-center justify-center text-center">
            Continue Shopping
          </Link>

          <div className="mt-4 p-3 bg-cream border border-sand">
            <p className="font-mono text-xs text-bark/70 leading-relaxed">
              💳 Payment via bank transfer<br />
              Maybank · 1234 5678 9012<br />
              RIJAL BIN HAMDI
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
