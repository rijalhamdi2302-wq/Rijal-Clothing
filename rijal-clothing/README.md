# RIJAL CLOTHING — E-Commerce Website

A clean, minimal clothing store with manual bank transfer payment and admin dashboard.

---

## Features

- 🛍️ Product shop — Hoodie, Sweatpant, T-Shirt, Windbreaker, Cap
- 🛒 Shopping cart with size + quantity selector
- 📦 Checkout form — name, email, phone, full address
- 💳 Manual payment (bank transfer) with payment slip upload
- ✅ Order confirmation page
- 🔐 Admin dashboard (password protected)
  - View all orders with full customer info
  - See payment slips inline
  - Update order status (pending → confirmed → shipped → delivered)
  - Filter and search orders
  - Revenue summary

---

## Products & Prices

| Product | Price |
|---|---|
| Classic Hoodie | RM 14.00 |
| Essential Sweatpant | RM 10.50 |
| Core Tee | RM 5.00 |
| Technical Windbreaker | RM 13.45 |
| Structured Cap | RM 6.70 |

---

## Bank Account (Update This!)

In `frontend/src/pages/Shop.jsx`, `Cart.jsx`, `Checkout.jsx`, and `OrderSuccess.jsx`, replace:
```
Maybank · 1234 5678 9012 · RIJAL BIN HAMDI
```
with your **real bank account details**.

---

## Admin Password

In `frontend/src/pages/Admin.jsx`, line 6:
```js
const ADMIN_PASS = 'rijal2024'
```
Change this to your own password before deploying.

Admin panel is at: `yoursite.vercel.app/admin`

---

## STEP 1 — MongoDB Atlas

1. Go to https://cloud.mongodb.com → create free account
2. Build a Database → M0 Free → any region
3. Create user: username + password (save them)
4. Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)
5. Connect → Drivers → copy connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/rijal_clothing?retryWrites=true&w=majority
   ```

---

## STEP 2 — Deploy Backend to Render

1. Go to https://render.com → New → Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Environment Variables:
   - `MONGODB_URI` → your Atlas connection string
   - `FRONTEND_URL` → your Vercel URL (fill after step 3)
   - `PORT` → `5000`
5. Deploy → copy your Render URL

> ⚠️ Important: Payment slip images are stored on Render's disk.
> Render's free tier has **ephemeral storage** — files may disappear on redeploy.
> For production, upgrade to a paid Render plan OR use Cloudinary for file storage.
> For now (testing/small use), the free tier works fine.

---

## STEP 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com → New Project → import repo
2. Root Directory: `frontend`
3. Environment Variable:
   - `VITE_API_URL` → your Render URL (e.g. `https://rijal-clothing-api.onrender.com`)
4. Deploy
5. Copy your Vercel URL → go back to Render → update `FRONTEND_URL` → redeploy

---

## Local Development

**Backend:**
```bash
cd backend
cp .env.example .env
# Fill in .env with your MongoDB URI
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

---

## File Structure

```
rijal-clothing/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Shop.jsx          # Product listing
│       │   ├── ProductDetail.jsx # Product page with size selector
│       │   ├── Cart.jsx          # Shopping cart
│       │   ├── Checkout.jsx      # Order form + payment slip upload
│       │   ├── OrderSuccess.jsx  # Confirmation page
│       │   ├── Admin.jsx         # Orders dashboard
│       │   └── OrderDetail.jsx   # Single order view
│       ├── components/
│       │   └── Navbar.jsx
│       └── context/
│           └── CartContext.jsx   # Products list + cart state
└── backend/
    ├── models/Order.js           # MongoDB schema
    ├── routes/orders.js          # All order API endpoints
    ├── middleware/upload.js      # Multer file upload handler
    └── server.js
```

---

*Rijal Clothing — Simple cuts. Quality fabric.*
