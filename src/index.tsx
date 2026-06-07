import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { landingPage } from './pages/landing'
import { adminPage } from './pages/admin'
import { storefrontPage } from './pages/storefront'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  GROQ_API_KEY?: string
  PAYU_KEY?: string
  PAYU_SALT?: string
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// ---------- helpers ----------
const OWNER_PREFIX = '2005' // platform owner PIN starts with 2005, e.g. 2005####
async function json(c: any, data: any, status = 200) { return c.json(data, status) }

// ============================================================
//  PUBLIC PLATFORM APIs
// ============================================================
app.get('/api/plans', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM plans ORDER BY price').all()
  return c.json(results)
})

// Platform owner login (PIN 2005####)
app.post('/api/owner/login', async (c) => {
  const { pin } = await c.req.json()
  // PIN must start with 2005 and be 8 chars. Default 2005#### -> any 8-digit beginning with 2005
  if (typeof pin === 'string' && pin.startsWith(OWNER_PREFIX) && pin.length >= 6) {
    return c.json({ ok: true, role: 'platform-owner' })
  }
  return c.json({ ok: false, error: 'Invalid owner PIN' }, 401)
})

// ============================================================
//  STORE PROVISIONING (when a business buys / starts trial)
// ============================================================
app.post('/api/stores', async (c) => {
  const b = await c.req.json()
  const slug = (b.slug || b.name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6)
  const trialEnds = new Date(Date.now() + 7 * 864e5).toISOString()
  try {
    const r = await c.env.DB.prepare(
      `INSERT INTO stores (slug, name, pin, category, theme, plan_id, trial_ends_at, currency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(slug, b.name || 'My Store', b.pin || '1234', b.category || 'general', b.theme || 'classic', b.plan_id || 1, trialEnds, b.currency || 'INR').run()
    return c.json({ ok: true, id: r.meta.last_row_id, slug })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message }, 400)
  }
})

// Store owner login by slug + pin
app.post('/api/store/login', async (c) => {
  const { slug, pin } = await c.req.json()
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ ok: false, error: 'Store not found' }, 404)
  // platform owner master PIN unlocks everything
  const isOwner = typeof pin === 'string' && pin.startsWith(OWNER_PREFIX)
  if (store.pin === pin || isOwner) return c.json({ ok: true, store, master: isOwner })
  return c.json({ ok: false, error: 'Wrong PIN' }, 401)
})

// ============================================================
//  STORE DATA (admin + public)
// ============================================================
app.get('/api/store/:slug', async (c) => {
  const slug = c.req.param('slug')
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const { results: products } = await c.env.DB.prepare('SELECT * FROM products WHERE store_id = ? AND available = 1 ORDER BY sort, id').bind(store.id).all()
  const { results: offers } = await c.env.DB.prepare('SELECT * FROM offers WHERE store_id = ? AND active = 1').bind(store.id).all()
  // never leak owner pin to public
  delete store.pin
  return c.json({ store, products, offers })
})

// Full store data for admin (requires pin)
app.post('/api/store/:slug/admin', async (c) => {
  const slug = c.req.param('slug')
  const { pin } = await c.req.json()
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const isOwner = typeof pin === 'string' && pin.startsWith(OWNER_PREFIX)
  if (store.pin !== pin && !isOwner) return c.json({ error: 'unauthorized' }, 401)
  const { results: products } = await c.env.DB.prepare('SELECT * FROM products WHERE store_id = ? ORDER BY sort, id').bind(store.id).all()
  const { results: orders } = await c.env.DB.prepare('SELECT * FROM orders WHERE store_id = ? ORDER BY id DESC LIMIT 100').bind(store.id).all()
  const { results: enquiries } = await c.env.DB.prepare('SELECT * FROM enquiries WHERE store_id = ? ORDER BY id DESC LIMIT 100').bind(store.id).all()
  const { results: offers } = await c.env.DB.prepare('SELECT * FROM offers WHERE store_id = ?').bind(store.id).all()
  return c.json({ store, products, orders, enquiries, offers })
})

// Update store settings
app.put('/api/store/:slug', async (c) => {
  const slug = c.req.param('slug')
  const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const isOwner = typeof b.pin === 'string' && b.pin.startsWith(OWNER_PREFIX)
  if (store.pin !== b.pin && !isOwner) return c.json({ error: 'unauthorized' }, 401)
  const fields = ['name','category','theme','logo_url','cover_url','tagline','about','phone','whatsapp','email','address','currency','upi_id','qr_url','bank_details','payment_link','payu_key','primary_color','white_label','custom_domain','ai_enabled','ai_context']
  const sets: string[] = [], vals: any[] = []
  for (const f of fields) if (f in b) { sets.push(`${f} = ?`); vals.push(b[f]) }
  // allow changing the store pin
  if (b.new_pin) { sets.push('pin = ?'); vals.push(b.new_pin) }
  if (!sets.length) return c.json({ ok: true })
  vals.push(store.id)
  await c.env.DB.prepare(`UPDATE stores SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return c.json({ ok: true })
})

// ---------- products CRUD ----------
app.post('/api/store/:slug/products', async (c) => {
  const slug = c.req.param('slug'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  const r = await c.env.DB.prepare('INSERT INTO products (store_id,name,description,price,category,image_url,available,sort) VALUES (?,?,?,?,?,?,?,?)')
    .bind(store.id, b.name, b.description || '', b.price || 0, b.category || '', b.image_url || '', b.available ?? 1, b.sort || 0).run()
  return c.json({ ok: true, id: r.meta.last_row_id })
})
app.put('/api/store/:slug/products/:id', async (c) => {
  const slug = c.req.param('slug'); const id = c.req.param('id'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  await c.env.DB.prepare('UPDATE products SET name=?,description=?,price=?,category=?,image_url=?,available=? WHERE id=? AND store_id=?')
    .bind(b.name, b.description || '', b.price || 0, b.category || '', b.image_url || '', b.available ?? 1, id, store.id).run()
  return c.json({ ok: true })
})
app.delete('/api/store/:slug/products/:id', async (c) => {
  const slug = c.req.param('slug'); const id = c.req.param('id'); const b = await c.req.json().catch(() => ({}))
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM products WHERE id=? AND store_id=?').bind(id, store.id).run()
  return c.json({ ok: true })
})

// ---------- offers CRUD ----------
app.post('/api/store/:slug/offers', async (c) => {
  const slug = c.req.param('slug'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  const r = await c.env.DB.prepare('INSERT INTO offers (store_id,title,code,discount,active) VALUES (?,?,?,?,?)')
    .bind(store.id, b.title, b.code || '', b.discount || '', b.active ?? 1).run()
  return c.json({ ok: true, id: r.meta.last_row_id })
})
app.delete('/api/store/:slug/offers/:id', async (c) => {
  const slug = c.req.param('slug'); const id = c.req.param('id'); const b = await c.req.json().catch(() => ({}))
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM offers WHERE id=? AND store_id=?').bind(id, store.id).run()
  return c.json({ ok: true })
})

// ---------- orders (public create, admin manage) ----------
app.post('/api/store/:slug/orders', async (c) => {
  const slug = c.req.param('slug'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const r = await c.env.DB.prepare('INSERT INTO orders (store_id,customer_name,customer_phone,customer_address,items,total,note) VALUES (?,?,?,?,?,?,?)')
    .bind(store.id, b.customer_name || '', b.customer_phone || '', b.customer_address || '', JSON.stringify(b.items || []), b.total || 0, b.note || '').run()
  return c.json({ ok: true, id: r.meta.last_row_id })
})
app.put('/api/store/:slug/orders/:id', async (c) => {
  const slug = c.req.param('slug'); const id = c.req.param('id'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  await c.env.DB.prepare('UPDATE orders SET status=? WHERE id=? AND store_id=?').bind(b.status, id, store.id).run()
  return c.json({ ok: true })
})

// ---------- enquiries (public create, admin manage) ----------
app.post('/api/store/:slug/enquiries', async (c) => {
  const slug = c.req.param('slug'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const r = await c.env.DB.prepare('INSERT INTO enquiries (store_id,name,phone,message,source) VALUES (?,?,?,?,?)')
    .bind(store.id, b.name || '', b.phone || '', b.message || '', b.source || 'form').run()
  return c.json({ ok: true, id: r.meta.last_row_id })
})
app.put('/api/store/:slug/enquiries/:id', async (c) => {
  const slug = c.req.param('slug'); const id = c.req.param('id'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT id, pin FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store || (store.pin !== b.pin && !(b.pin||'').startsWith(OWNER_PREFIX))) return c.json({ error: 'unauthorized' }, 401)
  await c.env.DB.prepare('UPDATE enquiries SET status=? WHERE id=? AND store_id=?').bind(b.status, id, store.id).run()
  return c.json({ ok: true })
})

// ============================================================
//  AI CHAT SUPPORT (Groq primary, Gemini fallback)
// ============================================================
app.post('/api/store/:slug/chat', async (c) => {
  const slug = c.req.param('slug'); const b = await c.req.json()
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE slug = ?').bind(slug).first<any>()
  if (!store) return c.json({ error: 'not found' }, 404)
  const userMsg = (b.message || '').toString().slice(0, 1000)
  const { results: products } = await c.env.DB.prepare('SELECT name, price, description FROM products WHERE store_id=? AND available=1').bind(store.id).all()
  const menuText = products.map((p: any) => `- ${p.name} (₹${p.price})${p.description ? ': ' + p.description : ''}`).join('\n')
  const sys = `You are a helpful customer support assistant for "${store.name}", a ${store.category}.
Store info: ${store.about || ''} ${store.ai_context || ''}
Contact: phone ${store.phone || 'N/A'}, whatsapp ${store.whatsapp || 'N/A'}.
Menu/Products:\n${menuText || 'No products listed.'}
Answer in English, be friendly and concise. If a customer wants to book/enquire, encourage them to use the Enquiry button. Never invent prices.`

  // Try Groq first
  const groqKey = c.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: sys }, { role: 'user', content: userMsg }],
          temperature: 0.4, max_tokens: 400
        })
      })
      if (r.ok) {
        const d: any = await r.json()
        const reply = d.choices?.[0]?.message?.content?.trim()
        if (reply) return c.json({ reply })
      }
    } catch (e) { /* fall through */ }
  }
  // Gemini fallback
  const gem = c.env.GEMINI_API_KEY
  if (gem) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gem}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: sys + '\n\nCustomer: ' + userMsg }] }] })
      })
      if (r.ok) {
        const d: any = await r.json()
        const reply = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (reply) return c.json({ reply })
      }
    } catch (e) { /* fall through */ }
  }
  return c.json({ reply: `Thanks for reaching out to ${store.name}! Our team will get back to you shortly. You can also send an enquiry and we'll contact you.` })
})

// ============================================================
//  PAYU PAYMENT (generate hash for buying a plan / store payment)
// ============================================================
async function sha512(str: string) {
  const data = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-512', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}
app.post('/api/pay/payu', async (c) => {
  const b = await c.req.json()
  const key = c.env.PAYU_KEY || 'WxDaR0'
  const salt = c.env.PAYU_SALT || ''
  const txnid = 'TXN' + Date.now() + Math.random().toString(36).slice(2, 6)
  const amount = (Number(b.amount) || 0).toFixed(2)
  const productinfo = b.productinfo || 'StoreKaro Plan'
  const firstname = b.firstname || 'Customer'
  const email = b.email || 'customer@example.com'
  // PayU hash sequence: key|txnid|amount|productinfo|firstname|email|udf1..udf5(empty)||||||salt
  const hashStr = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`
  const hash = salt ? await sha512(hashStr) : ''
  return c.json({
    ok: true,
    payu_url: 'https://test.payu.in/_payment', // test endpoint
    params: { key, txnid, amount, productinfo, firstname, email, hash,
      surl: b.surl || '/', furl: b.furl || '/', service_provider: 'payu_paisa' }
  })
})

// ============================================================
//  PAGES (HTML)
// ============================================================
app.get('/', (c) => c.html(landingPage()))
app.get('/admin', (c) => c.html(adminPage()))
app.get('/admin/:slug', (c) => c.html(adminPage()))
app.get('/s/:slug', (c) => c.html(storefrontPage()))

export default app
