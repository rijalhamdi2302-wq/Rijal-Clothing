import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Admin from './pages/Admin'
import OrderDetail from './pages/OrderDetail'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1C1C1C',
              color: '#F5F0E8',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.875rem',
              borderRadius: '0',
            },
          }}
        />
        <Routes>
          {/* Store routes with navbar */}
          <Route path="/" element={<><Navbar /><Shop /></>} />
          <Route path="/product/:id" element={<><Navbar /><ProductDetail /></>} />
          <Route path="/cart" element={<><Navbar /><Cart /></>} />
          <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
          <Route path="/order-success/:orderId" element={<><Navbar /><OrderSuccess /></>} />
          {/* Admin — no navbar */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/order/:id" element={<OrderDetail />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
