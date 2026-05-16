const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const upload = require('../middleware/upload')

// POST — create new order (with file upload)
router.post('/', upload.single('slip'), async (req, res) => {
  try {
    const {
      name, email, phone,
      address, city, postcode, state, notes,
      total
    } = req.body

    const items = JSON.parse(req.body.items || '[]')

    const order = await Order.create({
      name, email, phone,
      address, city, postcode, state, notes,
      items,
      total: parseFloat(total),
      slipUrl: req.file ? `/uploads/${req.file.filename}` : null,
      slipOriginalName: req.file?.originalname || null,
    })

    res.status(201).json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

// GET — all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET — single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// PATCH — update status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// DELETE — remove order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
