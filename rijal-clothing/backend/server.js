require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    /\.vercel\.app$/
  ],
  credentials: true
}))
app.use(express.json())

// Serve uploaded slips as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB error:', err))

// Routes
app.use('/api/orders', require('./routes/orders'))

app.get('/', (req, res) => res.json({ status: 'Rijal Clothing API ✓' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`⚡ Server on port ${PORT}`))
