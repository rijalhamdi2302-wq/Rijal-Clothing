import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, RefreshCw, LogOut, Package, Clock, CheckCircle, Truck } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ADMIN_PASS = 'rijal2024' // Change this to your password

const STATUS_OPTIONS = ['pending','confirmed','shipped','delivered','cancelled']

export default function Admin() {
  const [auth, setAuth] = useState(localStorage.getItem('admin_auth') === 'true')
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    if (auth) fetchOrders()
  }, [auth])

  const login = () => {
    if (password === ADMIN_PASS) {
      localStorage.setItem('admin_auth', 'true')
      setAuth(true)
    } else {
      toast.error('Wrong password')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    setAuth(false)
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (e) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success(`Status updated to ${status}`)
    } catch (e) {
      toast.error('Failed to update')
    }
  }

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0),
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.includes(search)
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  // Login screen
  if (!auth) return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-cream mb-2 text-center">Admin</h1>
        <p className="font-mono text-xs text-bark text-center mb-8 tracking-wider">RIJAL CLOTHING</p>
        <div className="card bg-charcoal border-bark/20 p-6">
          <label className="field-label text-bark mb-2 block">Password</label>
          <input
            type="password"
            className="field mb-4 bg-ink border-bark/30 text-cream"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          <button onClick={login} className="btn-primary w-full">Enter</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin nav */}
      <nav className="bg-ink text-cream px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-lg">RIJAL<span className="text-rust">.</span></span>
          <span className="font-mono text-xs text-bark tracking-widest">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchOrders} className="text-bark hover:text-cream transition-colors">
            <RefreshCw size={14} />
          </button>
          <Link to="/" className="font-mono text-xs text-bark hover:text-cream transition-colors">Store</Link>
          <button onClick={logout} className="text-bark hover:text-rust transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Orders Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Total Orders', val: stats.total, icon: Package },
            { label: 'Pending', val: stats.pending, icon: Clock },
            { label: 'Confirmed', val: stats.confirmed, icon: CheckCircle },
            { label: 'Shipped', val: stats.shipped, icon: Truck },
            { label: 'Revenue', val: `RM ${stats.revenue.toFixed(2)}`, icon: null },
          ].map(({ label, val, icon: Icon }) => (
            <div key={label} className="card p-4">
              <p className="font-mono text-xs text-bark uppercase tracking-wider mb-1">{label}</p>
              <p className="font-display text-xl font-bold text-rust">{val}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex-1 min-w-48 relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark" />
            <input
              className="field pl-8 py-2 text-sm"
              placeholder="Search name, email, order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['all', ...STATUS_OPTIONS].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`tag cursor-pointer capitalize transition-all ${
                  filter === s ? 'bg-ink text-cream border-ink' : 'text-bark border-bark/40 hover:border-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrap">
            {loading ? (
              <div className="p-12 text-center font-mono text-xs text-bark animate-pulse">Loading orders...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center font-mono text-xs text-bark">No orders found.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Slip</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/admin/order/${order._id}`} className="font-mono text-xs text-rust hover:underline">
                          #{order._id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td>
                        <p className="font-medium text-sm">{order.name}</p>
                        <p className="font-mono text-xs text-bark/60 mt-0.5">{order.city}, {order.state}</p>
                      </td>
                      <td>
                        <p className="text-xs">{order.email}</p>
                        <p className="font-mono text-xs text-bark/60">{order.phone}</p>
                      </td>
                      <td>
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-xs text-bark">
                              {item.name} ({item.size}) ×{item.qty}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-sm font-bold text-rust">RM {Number(order.total).toFixed(2)}</span>
                      </td>
                      <td>
                        {order.slipUrl ? (
                          <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${order.slipUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs text-sage hover:underline"
                          >
                            View Slip ↗
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-bark/30">—</span>
                        )}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className={`field py-1 px-2 text-xs font-mono cursor-pointer status-${order.status}`}
                          style={{ width: 'auto' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-bark/50">
                          {new Date(order.createdAt).toLocaleDateString('en-MY')}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/order/${order._id}`} className="btn-outline py-1 px-2 text-xs">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <p className="font-mono text-xs text-bark/30 mt-4 text-center">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown
        </p>
      </div>
    </div>
  )
}
