-- Plans / subscriptions
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  trial_days INTEGER DEFAULT 0,
  max_themes INTEGER DEFAULT 2,
  white_label INTEGER DEFAULT 0,
  custom_domain INTEGER DEFAULT 0,
  features TEXT,
  badge TEXT
);

-- Stores (each business = a tenant)
CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  theme TEXT DEFAULT 'classic',
  logo_url TEXT,
  cover_url TEXT,
  tagline TEXT,
  about TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  currency TEXT DEFAULT 'INR',
  plan_id INTEGER DEFAULT 1,
  trial_ends_at TEXT,
  -- payment config
  upi_id TEXT,
  qr_url TEXT,
  bank_details TEXT,
  payment_link TEXT,
  payu_key TEXT,
  -- branding
  primary_color TEXT DEFAULT '#4f46e5',
  white_label INTEGER DEFAULT 0,
  custom_domain TEXT,
  -- ai
  ai_enabled INTEGER DEFAULT 1,
  ai_context TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Products / menu items
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT,
  image_url TEXT,
  available INTEGER DEFAULT 1,
  sort INTEGER DEFAULT 0,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  items TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'new',
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  name TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'form',
  status TEXT DEFAULT 'open',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Offers / coupons
CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  code TEXT,
  discount TEXT,
  active INTEGER DEFAULT 1,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_store ON enquiries(store_id);
CREATE INDEX IF NOT EXISTS idx_offers_store ON offers(store_id);
