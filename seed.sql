-- Plans
INSERT OR IGNORE INTO plans (id, name, price, trial_days, max_themes, white_label, custom_domain, features, badge) VALUES
 (1, 'Starter', 250, 7, 2, 0, 0, 'Online store|Menu & catalog|Order booking|Enquiry form|2 themes|Basic support', 'Best for new owners'),
 (2, 'Growth', 799, 7, 5, 0, 1, 'Everything in Starter|All premium themes|AI chat support|Offers & coupons|Custom domain|Payment gateway (PayU)|Priority support', 'Most popular'),
 (3, 'Business', 1499, 7, 99, 1, 1, 'Everything in Growth|White-label branding|Custom logo|Remove StoreKaro branding|Multiple stores|Advanced analytics|Dedicated support', 'For large brands');

-- Demo store (PIN: demo store uses 200512)
INSERT OR IGNORE INTO stores (id, slug, name, pin, category, theme, tagline, about, phone, whatsapp, currency, plan_id, upi_id, primary_color, ai_enabled, ai_context)
VALUES (1, 'demo-cafe', 'Bella Cafe', '200512', 'restaurant', 'premium-dark', 'Coffee. Comfort. Community.', 'A cozy neighbourhood cafe serving artisan coffee and fresh bakes.', '+919999999999', '919999999999', 'INR', 2, 'bellacafe@upi', '#b45309', 1, 'We are a cafe open 8am-10pm. We serve coffee, sandwiches, cakes. Delivery within 5km.');

INSERT OR IGNORE INTO products (store_id, name, description, price, category, available, sort) VALUES
 (1, 'Cappuccino', 'Rich espresso with steamed milk foam', 150, 'Beverages', 1, 1),
 (1, 'Cold Brew', 'Smooth 18-hour cold brewed coffee', 180, 'Beverages', 1, 2),
 (1, 'Veg Sandwich', 'Grilled sandwich with fresh veggies', 120, 'Food', 1, 3),
 (1, 'Chocolate Cake', 'Decadent slice of chocolate cake', 200, 'Desserts', 1, 4);

INSERT OR IGNORE INTO offers (store_id, title, code, discount, active) VALUES
 (1, 'Welcome 10% off', 'WELCOME10', '10%', 1);
