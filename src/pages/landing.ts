export const landingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>StoreKaro — Launch Your Online Store, Menu & Ordering in Minutes</title>
<meta name="description" content="StoreKaro is the all-in-one platform for restaurants, shops & service businesses to create a stunning online store, accept orders, take enquiries, get AI chat support and accept UPI/PayU payments. No code. Free 7-day trial.">
<meta name="keywords" content="online store builder, restaurant menu app, order booking, small business website, shopify alternative india, upi payments, qr menu">
<meta property="og:title" content="StoreKaro — Your Business, Online in Minutes">
<meta property="og:description" content="Beautiful storefronts, online ordering, AI support & payments. Built for Indian businesses.">
<meta property="og:type" content="website">
<link rel="canonical" href="/">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"StoreKaro","applicationCategory":"BusinessApplication","offers":{"@type":"Offer","price":"250","priceCurrency":"INR"},"operatingSystem":"Web"}</script>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
.gradient{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#db2777 100%)}
.glass{backdrop-filter:blur(12px);background:rgba(255,255,255,.08)}
.fade{animation:f .8s ease both}@keyframes f{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
</style>
</head>
<body class="bg-slate-50 text-slate-800">
<!-- Nav -->
<header class="gradient text-white sticky top-0 z-40 shadow-lg">
  <nav class="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
    <a href="/" class="text-2xl font-extrabold tracking-tight"><i class="fas fa-store mr-2"></i>StoreKaro</a>
    <div class="flex items-center gap-3">
      <a href="#plans" class="hidden sm:inline text-white/90 hover:text-white">Pricing</a>
      <a href="#features" class="hidden sm:inline text-white/90 hover:text-white">Features</a>
      <button onclick="openOwner()" class="text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><i class="fas fa-user-shield mr-1"></i>Owner</button>
      <a href="#plans" class="bg-white text-indigo-700 font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">Start Free</a>
    </div>
  </nav>
</header>

<!-- Hero -->
<section class="gradient text-white">
  <div class="max-w-6xl mx-auto px-5 py-20 text-center fade">
    <span class="glass inline-block px-4 py-1.5 rounded-full text-sm mb-5">🚀 The Shopify alternative built for India</span>
    <h1 class="text-4xl sm:text-6xl font-extrabold leading-tight">Your business, online<br>in <span class="text-yellow-300">5 minutes.</span></h1>
    <p class="mt-6 text-lg text-white/90 max-w-2xl mx-auto">Beautiful storefront, online menu, order booking, enquiries, AI chat support and UPI/PayU payments — all from one simple dashboard. No code. No designer. No headache.</p>
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#plans" class="bg-yellow-300 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition text-lg">Start 7-Day Free Trial</a>
      <a href="/s/demo-cafe" class="glass text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition text-lg"><i class="fas fa-eye mr-2"></i>View Live Demo</a>
    </div>
    <p class="mt-4 text-white/70 text-sm">No card required • Cancel anytime • Set up in minutes</p>
  </div>
</section>

<!-- Trust strip -->
<div class="bg-white border-b py-6">
  <div class="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
    <div><div class="text-2xl font-extrabold text-indigo-600">99%</div><div class="text-sm text-slate-500">Setup success</div></div>
    <div><div class="text-2xl font-extrabold text-indigo-600">₹250</div><div class="text-sm text-slate-500">Starts from</div></div>
    <div><div class="text-2xl font-extrabold text-indigo-600">24/7</div><div class="text-sm text-slate-500">AI support</div></div>
    <div><div class="text-2xl font-extrabold text-indigo-600">UPI</div><div class="text-sm text-slate-500">+ PayU payments</div></div>
  </div>
</div>

<!-- Features -->
<section id="features" class="max-w-6xl mx-auto px-5 py-20">
  <h2 class="text-3xl sm:text-4xl font-extrabold text-center">Everything your business needs</h2>
  <p class="text-center text-slate-500 mt-3 max-w-2xl mx-auto">More features than platforms costing thousands of dollars — at a price even a small shop can afford.</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
    ${[
      ['fa-store','Beautiful Storefront','Stunning, mobile-first store pages. Pick from premium themes for any category.'],
      ['fa-utensils','Online Menu & Catalog','Add products/dishes with photos, prices & categories. Update anytime.'],
      ['fa-cart-shopping','Order Booking','Customers order directly. You get instant orders in your dashboard.'],
      ['fa-comments','AI Chat Support','24/7 AI assistant answers customers & captures enquiries automatically.'],
      ['fa-qrcode','UPI / QR / PayU Payments','Accept payments via UPI ID, QR code, bank details, payment links or PayU gateway.'],
      ['fa-tags','Offers & Coupons','Create discounts and promo codes to boost sales.'],
      ['fa-palette','Custom Branding','Your logo, your colors. White-label option to remove our branding.'],
      ['fa-globe','Custom Domain','Connect your own domain or host anywhere you like.'],
      ['fa-chart-line','SEO Optimized','Built to rank on Google so customers find you.'],
    ].map(f => `<div class="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-xl hover:-translate-y-1 transition">
      <div class="w-12 h-12 rounded-xl gradient text-white grid place-items-center text-xl mb-4"><i class="fas ${f[0]}"></i></div>
      <h3 class="font-bold text-lg">${f[1]}</h3><p class="text-slate-500 mt-2 text-sm">${f[2]}</p></div>`).join('')}
  </div>
</section>

<!-- Plans -->
<section id="plans" class="bg-slate-100 py-20">
  <div class="max-w-6xl mx-auto px-5">
    <h2 class="text-3xl sm:text-4xl font-extrabold text-center">Simple, honest pricing</h2>
    <p class="text-center text-slate-500 mt-3">Every plan includes a 7-day free trial. No hidden fees.</p>
    <div id="plans-grid" class="grid md:grid-cols-3 gap-6 mt-12"><p class="text-center col-span-3 text-slate-400">Loading plans…</p></div>
  </div>
</section>

<!-- CTA -->
<section class="gradient text-white py-16 text-center">
  <div class="max-w-3xl mx-auto px-5">
    <h2 class="text-3xl font-extrabold">Ready to grow your business?</h2>
    <p class="mt-3 text-white/90">Join businesses going online the smart way. Start your free trial today.</p>
    <a href="#plans" class="inline-block mt-6 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition">Get Started Free</a>
  </div>
</section>

<footer class="bg-slate-900 text-slate-400 py-10 text-center text-sm">
  <p class="text-white font-bold text-lg mb-2"><i class="fas fa-store mr-2"></i>StoreKaro</p>
  <p>The all-in-one storefront platform for modern businesses.</p>
  <p class="mt-4">© ${new Date().getFullYear()} StoreKaro. All rights reserved.</p>
</footer>

<!-- Signup Modal -->
<div id="signup" class="hidden fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
  <div class="bg-white rounded-2xl p-6 w-full max-w-md fade">
    <div class="flex justify-between items-center mb-4"><h3 class="text-xl font-bold">Start your free trial</h3><button onclick="close_('signup')" class="text-slate-400 hover:text-slate-700"><i class="fas fa-times"></i></button></div>
    <p id="signup-plan" class="text-sm text-indigo-600 font-semibold mb-4"></p>
    <input id="su-name" placeholder="Business name" class="w-full border rounded-lg px-3 py-2.5 mb-3">
    <select id="su-cat" class="w-full border rounded-lg px-3 py-2.5 mb-3">
      <option value="restaurant">Restaurant / Cafe</option><option value="retail">Retail / Shop</option>
      <option value="grocery">Grocery / Kirana</option><option value="salon">Salon / Spa</option>
      <option value="service">Services</option><option value="general">Other</option>
    </select>
    <input id="su-pin" placeholder="Set your admin PIN (e.g. 1234)" class="w-full border rounded-lg px-3 py-2.5 mb-4">
    <button onclick="doSignup()" class="w-full gradient text-white font-bold py-3 rounded-lg">Create My Store</button>
    <p id="su-msg" class="text-sm mt-3 text-center"></p>
  </div>
</div>

<!-- Owner Modal -->
<div id="owner" class="hidden fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
  <div class="bg-white rounded-2xl p-6 w-full max-w-sm fade text-center">
    <button onclick="close_('owner')" class="float-right text-slate-400"><i class="fas fa-times"></i></button>
    <div class="w-14 h-14 rounded-full gradient text-white grid place-items-center text-2xl mx-auto mb-3"><i class="fas fa-user-shield"></i></div>
    <h3 class="text-xl font-bold">Platform Owner</h3>
    <p class="text-sm text-slate-500 mb-4">Enter your master PIN to unlock everything free.</p>
    <input id="own-pin" type="password" placeholder="Owner PIN" class="w-full border rounded-lg px-3 py-2.5 mb-3 text-center tracking-widest">
    <button onclick="doOwner()" class="w-full gradient text-white font-bold py-3 rounded-lg">Login</button>
    <p id="own-msg" class="text-sm mt-3"></p>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
let selectedPlan = 1;
async function loadPlans(){
  const {data} = await axios.get('/api/plans');
  const colors=['border-slate-200','border-indigo-500 ring-2 ring-indigo-300','border-slate-200'];
  document.getElementById('plans-grid').innerHTML = data.map((p,i)=>\`
    <div class="bg-white rounded-2xl p-7 shadow-sm border-2 \${colors[i]||'border-slate-200'} relative flex flex-col">
      \${p.badge?\`<span class="absolute -top-3 left-1/2 -translate-x-1/2 gradient text-white text-xs font-bold px-3 py-1 rounded-full">\${p.badge}</span>\`:''}
      <h3 class="text-xl font-extrabold">\${p.name}</h3>
      <div class="mt-2"><span class="text-4xl font-extrabold">₹\${p.price}</span><span class="text-slate-400">/mo</span></div>
      <p class="text-green-600 text-sm font-semibold mt-1">\${p.trial_days}-day free trial</p>
      <ul class="mt-5 space-y-2 text-sm text-slate-600 flex-1">
        \${(p.features||'').split('|').map(f=>\`<li><i class="fas fa-check text-green-500 mr-2"></i>\${f}</li>\`).join('')}
      </ul>
      <button onclick="openSignup(\${p.id},'\${p.name}',\${p.price})" class="mt-6 w-full gradient text-white font-bold py-3 rounded-lg hover:opacity-90">Start Free Trial</button>
      <button onclick="buyNow(\${p.price},'\${p.name}')" class="mt-2 w-full border-2 border-indigo-500 text-indigo-600 font-bold py-2.5 rounded-lg hover:bg-indigo-50">Buy Now</button>
    </div>\`).join('');
}
function openSignup(id,name,price){selectedPlan=id;document.getElementById('signup-plan').textContent=name+' Plan • ₹'+price+'/mo (7 days free)';document.getElementById('signup').classList.remove('hidden')}
function close_(id){document.getElementById(id).classList.add('hidden')}
function openOwner(){document.getElementById('owner').classList.remove('hidden')}
async function doSignup(){
  const name=su_name.value.trim(), pin=su_pin.value.trim(), category=su_cat.value;
  if(!name||!pin){su_msg.innerHTML='<span class="text-red-500">Please fill all fields</span>';return}
  su_msg.textContent='Creating…';
  try{
    const {data}=await axios.post('/api/stores',{name,pin,category,plan_id:selectedPlan});
    if(data.ok){su_msg.innerHTML='<span class="text-green-600">Store created! Redirecting…</span>';
      setTimeout(()=>location.href='/admin/'+data.slug,1200)}
    else su_msg.innerHTML='<span class="text-red-500">'+data.error+'</span>';
  }catch(e){su_msg.innerHTML='<span class="text-red-500">Error, try again</span>'}
}
async function doOwner(){
  const pin=own_pin.value.trim();
  try{const {data}=await axios.post('/api/owner/login',{pin});
    if(data.ok){localStorage.setItem('ownerPin',pin);own_msg.innerHTML='<span class="text-green-600">Unlocked! All features free for you ✓</span>';
      setTimeout(()=>location.href='/s/demo-cafe',1000)}
    else own_msg.innerHTML='<span class="text-red-500">Invalid PIN</span>';
  }catch(e){own_msg.innerHTML='<span class="text-red-500">Invalid PIN</span>'}
}
async function buyNow(amount,name){
  const ownerPin=localStorage.getItem('ownerPin');
  if(ownerPin&&ownerPin.startsWith('2005')){alert('As platform owner, everything is free for you ✓');return}
  try{
    const {data}=await axios.post('/api/pay/payu',{amount,productinfo:name+' Plan',surl:location.origin,furl:location.origin});
    if(!data.ok)return alert('Payment init failed');
    const f=document.createElement('form');f.method='POST';f.action=data.payu_url;
    for(const k in data.params){const i=document.createElement('input');i.type='hidden';i.name=k;i.value=data.params[k];f.appendChild(i)}
    document.body.appendChild(f);
    if(!data.params.hash){alert('Note: PayU salt key not configured on server yet. Test mode will open.');}
    f.submit();
  }catch(e){alert('Payment error')}
}
loadPlans();
</script>
</body></html>`
