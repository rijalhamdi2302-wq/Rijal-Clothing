import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', postcode: '', state: '', notes: ''
  })
  const [slip, setSlip] = useState(null)
  const [slipPreview, setSlipPreview] = useState(null)
  const [drag, setDrag] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (cart.length === 0) {
    navigate('/')
    return null
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) return toast.error('Only JPG, PNG, WEBP or PDF allowed')
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large — max 5MB')
    setSlip(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => setSlipPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setSlipPreview('pdf')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!slip) return toast.error('Please upload your payment slip')

    const required = ['name', 'email', 'phone', 'address', 'city', 'postcode', 'state']
    for (const k of required) {
      if (!form[k].trim()) return toast.error(`Please fill in: ${k}`)
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      // Customer info
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      // Order items
      fd.append('items', JSON.stringify(cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        size: i.size,
        qty: i.qty,
        subtotal: +(i.price * i.qty).toFixed(2)
      }))))
      fd.append('total', total.toFixed(2))
      fd.append('slip', slip)

      const res = await api.post('/orders', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      clearCart()
      navigate(`/order-success/${res.data._id}`)
    } catch (err) {
      toast.error('Failed to place order. Try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8 fade-up">Checkout</h1>

      <form onSubmit={submit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left — form */}
          <div className="md:col-span-2 space-y-6">

            {/* Personal Info */}
            <div className="card p-5 fade-up delay-1">
              <h2 className="font-display text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input className="field" placeholder="Muhammad Rijal" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input className="field" type="email" placeholder="rijal@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label">Phone Number *</label>
                  <input className="field" placeholder="01X-XXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-5 fade-up delay-2">
              <h2 className="font-display text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="field-label">Street Address *</label>
                  <input className="field" placeholder="No. 12, Jalan Mawar 3" value={form.address} onChange={e => set('address', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">City *</label>
                    <input className="field" placeholder="Cyberjaya" value={form.city} onChange={e => set('city', e.target.value)} required />
                  </div>
                  <div>
                    <label className="field-label">Postcode *</label>
                    <input className="field" placeholder="63000" value={form.postcode} onChange={e => set('postcode', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="field-label">State *</label>
                  <select className="field" value={form.state} onChange={e => set('state', e.target.value)} required>
                    <option value="">Select state</option>
                    {['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label">Order Notes (optional)</label>
                  <textarea className="field" placeholder="Any special instructions..." rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment Slip */}
            <div className="card p-5 fade-up delay-3">
              <h2 className="font-display text-xl font-semibold mb-2">Payment Slip *</h2>
              <div className="bg-cream border border-sand p-3 mb-4">
                <p className="font-mono text-xs text-bark/80 leading-relaxed">
                  Transfer to: <strong className="text-ink">Maybank · 1234 5678 9012</strong><br />
                  Account Name: <strong className="text-ink">RIJAL BIN HAMDI</strong><br />
                  Amount: <strong className="text-rust">RM {total.toFixed(2)}</strong>
                </p>
              </div>

              {!slip ? (
                <div
                  className={`upload-area ${drag ? 'dragover' : ''}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDrag(true) }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
                >
                  <Upload size={24} className="mx-auto text-bark mb-2" />
                  <p className="font-mono text-xs text-bark/70">Click or drag your payment slip here</p>
                  <p className="font-mono text-xs text-bark/40 mt-1">JPG · PNG · PDF — max 5MB</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="relative border border-sand p-3 bg-cream">
                  {slipPreview === 'pdf' ? (
                    <div className="flex items-center gap-3 py-4">
                      <div className="w-10 h-10 bg-rust/10 flex items-center justify-center text-rust text-lg">📄</div>
                      <div>
                        <p className="font-body text-sm font-medium">{slip.name}</p>
                        <p className="font-mono text-xs text-bark/50">{(slip.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <img src={slipPreview} alt="slip" className="max-h-48 object-contain mx-auto" />
                  )}
                  <button
                    type="button"
                    onClick={() => { setSlip(null); setSlipPreview(null) }}
                    className="absolute top-2 right-2 bg-ink text-cream w-6 h-6 flex items-center justify-center hover:bg-rust transition-colors"
                  >
                    <X size={12} />
                  </button>
                  <p className="font-mono text-xs text-sage text-center mt-2 flex items-center justify-center gap-1">
                    <Check size={11} /> Slip uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right — summary */}
          <div className="card p-5 h-fit fade-up delay-2">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            <div className="divider" />
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm mb-2 gap-2">
                <span className="text-bark font-body leading-snug">{item.name} ({item.size}) ×{item.qty}</span>
                <span className="font-mono text-xs shrink-0">RM {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-bark">Total</span>
              <span className="font-mono font-bold text-rust text-lg">RM {total.toFixed(2)}</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="font-mono text-xs text-bark/40 text-center mt-3 leading-relaxed">
              By placing your order, you confirm that payment has been transferred.
            </p>
          </div>
        </div>
      </form>
    </main>
  )
}
