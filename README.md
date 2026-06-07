# StoreKaro 🛍️

**The all-in-one storefront SaaS platform for businesses — a Shopify alternative built for India.**

Sell this single app to unlimited business owners (restaurants, shops, salons, services). Each business gets a beautiful online store with menu, online ordering, enquiries, AI chat support, offers, custom branding and UPI/PayU payments — all manageable from their own admin panel. You (the platform owner) manage everything with a master PIN.

---

## ✅ Completed Features

### For the Platform Owner (you — sells the app)
- **SEO-optimized landing page** with pricing plans, features, free trial & "Buy Now" (PayU)
- **3 subscription plans**: Starter ₹250, Growth ₹799, Business ₹1499 — each with **7-day free trial**
- **Owner master PIN** (`2005####`) — unlocks every store & all features **free** for testing/management. Owner PIN is **changeable**.
- **PayU "Buy Now"** integration (SHA-512 hash generated server-side; owner bypasses payment for free)

### For Business Owners (your customers)
- **Instant store creation** (free trial signup) — gets a unique store URL `/s/<slug>` and admin panel `/admin/<slug>`
- **Admin dashboard** with PIN login — 8 sections:
  - **Overview** — stats + shareable store link + trial status
  - **Products/Menu** — add/edit/delete items with photos, prices, categories, availability
  - **Orders** — receive customer orders, update status (new/confirmed/completed/cancelled)
  - **Enquiries** — receive & manage customer enquiries (form + AI captured)
  - **Offers** — create coupons & discounts
  - **Theme** — choose from 5 premium themes + custom brand color
  - **Payments** — UPI ID, QR code, bank details, payment link, PayU key
  - **Settings** — name, logo, cover, contact, WhatsApp, custom domain, white-label, AI knowledge, change PIN

### For End Customers (store visitors)
- Beautiful mobile-first storefront with theme + branding
- Browse menu/catalog by category
- **Add to cart & place orders** with name/phone/address
- See **payment options** (UPI/QR/bank/link) at checkout
- **Send enquiries**
- **AI chat support** (live, powered by Groq Llama-3.3 with Gemini fallback) that knows the store's menu, hours & policies
- WhatsApp / Call buttons

### Themes (5)
`Classic`, `Warm Sunset` (free) · `Premium Dark`, `Fresh Green`, `Elegant Purple` (premium)

---

## 🌐 Functional URLs (paths & parameters)

| Path | Description |
|------|-------------|
| `/` | Landing page (plans, signup, owner login, buy) |
| `/admin` | Admin login (enter store slug + PIN) |
| `/admin/:slug` | Direct admin for a store |
| `/s/:slug` | Public storefront (e.g. `/s/demo-cafe`) |

### API
- `GET /api/plans` — list plans
- `POST /api/owner/login` `{pin}` — owner master login
- `POST /api/stores` `{name,pin,category,plan_id}` — create store (free trial)
- `POST /api/store/login` `{slug,pin}` — store owner login
- `GET /api/store/:slug` — public store data (products + offers)
- `POST /api/store/:slug/admin` `{pin}` — full admin data
- `PUT /api/store/:slug` — update settings (auth by pin)
- `POST|PUT|DELETE /api/store/:slug/products[/:id]` — manage products
- `POST|DELETE /api/store/:slug/offers[/:id]` — manage offers
- `POST /api/store/:slug/orders` / `PUT .../orders/:id` — orders
- `POST /api/store/:slug/enquiries` / `PUT .../enquiries/:id` — enquiries
- `POST /api/store/:slug/chat` `{message}` — AI support
- `POST /api/pay/payu` `{amount,productinfo}` — PayU payment hash

---

## 🗄️ Data Architecture
- **Storage**: Cloudflare D1 (SQLite). Tables: `plans`, `stores` (tenants), `products`, `orders`, `enquiries`, `offers`
- **Multi-tenant**: every business = one row in `stores`; all data scoped by `store_id`
- **Auth**: per-store PIN; platform owner master PIN (`2005…`) overrides everything

---

## 🚀 Deployment

> Built on **Cloudflare Pages + Hono**. You said you'll deploy to **Netlify / your own domain** — this app is a Worker, so the recommended host is **Cloudflare Pages** (free). It can also run anywhere that supports the Workers runtime. Business owners can connect their **custom domain** via the Settings tab.

### Local / sandbox
```bash
npm install
npm run build
npx wrangler d1 migrations apply storekaro-production --local
npx wrangler d1 execute storekaro-production --local --file=./seed.sql
pm2 start ecosystem.config.cjs
```

### Production (Cloudflare Pages)
```bash
npx wrangler d1 create storekaro-production      # put the id in wrangler.jsonc
npx wrangler d1 migrations apply storekaro-production
npx wrangler pages deploy dist --project-name storekaro
# add secrets:
npx wrangler pages secret put GROQ_API_KEY
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put PAYU_KEY
npx wrangler pages secret put PAYU_SALT
```

---

## 🔑 Demo / Login Info
- **Owner master PIN**: `2005` + any digits (e.g. `20050000`) — changeable, unlocks all stores free
- **Demo store**: slug `demo-cafe`, admin PIN `200512`
- **Demo storefront**: `/s/demo-cafe`

---

## 📌 Not Yet Implemented / Next Steps
- Image **upload** (currently uses image URLs — pair with Cloudflare R2 for uploads)
- Subscription billing/renewal automation & PayU webhook verification (currently checkout hash only)
- Analytics charts, email notifications (add SendGrid/Resend), multi-store owner accounts
- More themes per category

## 🧱 Tech Stack
Hono · TypeScript · Cloudflare Pages/Workers · D1 · TailwindCSS (CDN) · Groq + Gemini AI · PayU

**Last Updated**: 2026-06-07
