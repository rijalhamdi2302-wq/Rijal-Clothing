import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display font-bold text-xl tracking-tight text-ink">
          RIJAL<span className="text-rust">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`nav-link ${loc.pathname === '/' ? 'active' : ''}`}>Shop</Link>
          <Link to="/cart" className="relative">
            <ShoppingBag size={18} className="text-ink" />
            {count > 0 && (
              <span className="badge">{count}</span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={18} />
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-sand bg-cream px-4 py-4 space-y-4">
          <Link to="/" className="nav-link block" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/cart" className="nav-link block" onClick={() => setOpen(false)}>Cart ({count})</Link>
        </div>
      )}
    </nav>
  )
}
