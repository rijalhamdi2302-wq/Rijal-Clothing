import React, { createContext, useContext, useState } from 'react'

export const PRODUCTS = [
  {
    id: 'hoodie',
    name: 'Classic Hoodie',
    price: 14.00,
    category: 'Tops',
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'Heavyweight cotton fleece. Dropped shoulders. Kangaroo pocket. The cornerstone of any wardrobe.',
    color: '#3D3D3D',
    emoji: '🧥',
  },
  {
    id: 'sweatpant',
    name: 'Essential Sweatpant',
    price: 10.50,
    category: 'Bottoms',
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'French terry cotton. Tapered fit. Elastic waistband with drawstring. Built for comfort and movement.',
    color: '#5C5C5C',
    emoji: '👖',
  },
  {
    id: 'tshirt',
    name: 'Core Tee',
    price: 5.00,
    category: 'Tops',
    sizes: ['XS','S','M','L','XL','XXL'],
    description: '180gsm combed cotton. Boxy fit. Ribbed collar. The essential blank canvas.',
    color: '#F5F0E8',
    emoji: '👕',
  },
  {
    id: 'windbreaker',
    name: 'Technical Windbreaker',
    price: 13.45,
    category: 'Outerwear',
    sizes: ['S','M','L','XL','XXL'],
    description: 'Nylon shell. Full zip. Packable hood. Seam-sealed. Your shield against the elements.',
    color: '#2C4A3E',
    emoji: '🧣',
  },
  {
    id: 'cap',
    name: 'Structured Cap',
    price: 6.70,
    category: 'Accessories',
    sizes: ['One Size'],
    description: '6-panel cotton twill. Embroidered branding. Adjustable strapback. Minimal and precise.',
    color: '#1C1C1C',
    emoji: '🧢',
  },
]

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  const addToCart = (product, size, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, { ...product, size, qty }]
    })
  }

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }

  const updateQty = (id, size, qty) => {
    if (qty < 1) return removeFromCart(id, size)
    setCart(prev => prev.map(i =>
      i.id === id && i.size === size ? { ...i, qty } : i
    ))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
