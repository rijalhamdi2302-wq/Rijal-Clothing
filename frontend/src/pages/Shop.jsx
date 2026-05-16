import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../context/CartContext'

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']

export default function Shop() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter)

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-12 fade-up">
        <p className="font-mono text-xs text-bark tracking-widest uppercase mb-3">Est. 2024 — Kuala Lumpur</p>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-none text-ink mb-4">
          Rijal<br />
          <span className="italic font-normal text-rust">Clothing</span>
        </h1>
        <p className="font-accent text-lg text-bark/80 italic max-w-md">
          Simple cuts. Quality fabric. Made for the ones who move with intention.
        </p>
      </div>

      {/* Bank info strip */}
      <div className="bg-charcoal text-cream px-5 py-3 mb-10 flex flex-wrap items-center gap-3 fade-up delay-1">
        <span className="font-mono text-xs tracking-widest uppercase text-bark">Payment</span>
        <span className="text-sand/40">|</span>
        <span className="font-mono text-xs text-sand">Maybank · 1234 5678 9012 · RIJAL BIN HAMDI</span>
        <span className="text-sand/40 hidden md:block">|</span>
        <span className="font-mono text-xs text-sand/60">Manual transfer — upload slip at checkout</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-8 fade-up delay-2">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`tag cursor-pointer transition-all ${
              filter === c
                ? 'bg-ink text-cream border-ink'
                : 'text-bark border-bark/40 hover:border-ink hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product, i) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className={`product-card card block fade-up delay-${Math.min(i + 1, 4)}`}
          >
            {/* Product visual */}
            <div
              className="aspect-square flex items-center justify-center text-6xl md:text-7xl relative overflow-hidden"
              style={{ background: `${product.color}15` }}
            >
              <span className="relative z-10 select-none">{product.emoji}</span>
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }}
              />
            </div>

            {/* Info */}
            <div className="p-3 md:p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-mono text-xs text-bark uppercase tracking-wide">{product.category}</p>
                  <h3 className="font-display font-semibold text-base leading-tight mt-0.5">{product.name}</h3>
                </div>
              </div>
              <p className="font-mono text-sm text-rust font-bold mt-2">
                RM {product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-sand flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs text-bark/50 tracking-widest">© 2024 RIJAL CLOTHING</p>
        <Link to="/admin" className="font-mono text-xs text-bark/30 hover:text-bark transition-colors">
          Admin →
        </Link>
      </div>
    </main>
  )
}
