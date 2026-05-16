import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react'
import { PRODUCTS, useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = PRODUCTS.find(p => p.id === id)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="font-mono text-bark">Product not found.</p>
      <Link to="/" className="btn-outline mt-4 inline-block">Back to Shop</Link>
    </div>
  )

  const handleAdd = () => {
    if (!size) return toast.error('Select a size first')
    addToCart(product, size, qty)
    setAdded(true)
    toast.success(`${product.name} added to bag`)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-xs text-bark hover:text-ink transition-colors mb-8">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Visual */}
        <div
          className="aspect-square flex items-center justify-center text-[120px] md:text-[160px] card fade-up"
          style={{ background: `${product.color}12` }}
        >
          <span className="select-none">{product.emoji}</span>
        </div>

        {/* Info */}
        <div className="fade-up delay-1">
          <span className="tag text-bark border-bark/30">{product.category}</span>
          <h1 className="font-display text-4xl font-bold mt-3 mb-2">{product.name}</h1>
          <p className="font-mono text-2xl text-rust font-bold mb-6">RM {product.price.toFixed(2)}</p>

          <div className="divider" />

          <p className="text-bark text-sm leading-relaxed mb-6 font-accent italic text-base">
            {product.description}
          </p>

          {/* Size */}
          <div className="mb-6">
            <p className="field-label mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  className={`size-btn ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mb-8">
            <p className="field-label mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="font-mono text-sm w-8 text-center">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Subtotal */}
          <p className="font-mono text-xs text-bark mb-4">
            Subtotal: <span className="text-ink">RM {(product.price * qty).toFixed(2)}</span>
          </p>

          <button onClick={handleAdd} className="btn-primary w-full flex items-center justify-center gap-2">
            {added ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Bag</>}
          </button>

          <div className="divider" />

          <div className="space-y-2">
            <p className="font-mono text-xs text-bark/60">✓ Manual bank transfer payment</p>
            <p className="font-mono text-xs text-bark/60">✓ Upload payment slip at checkout</p>
            <p className="font-mono text-xs text-bark/60">✓ Orders processed within 1-2 business days</p>
          </div>
        </div>
      </div>
    </main>
  )
}
