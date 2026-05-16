const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  size: String,
  qty: Number,
  subtotal: Number,
})

const OrderSchema = new mongoose.Schema({
  // Customer
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  // Address
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  state: { type: String, required: true },
  notes: String,

  // Order
  items: [OrderItemSchema],
  total: { type: Number, required: true },

  // Payment
  slipUrl: String,   // path to uploaded file
  slipOriginalName: String,

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
