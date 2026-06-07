export const adminPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard — StoreKaro</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>.tab.active{background:#4f46e5;color:#fff}.fade{animation:f .4s ease both}@keyframes f{from{opacity:0}to{opacity:1}}</style>
</head>
<body class="bg-slate-100 min-h-screen">

<!-- Login -->
<div id="login" class="fixed inset-0 grid place-items-center p-4 bg-gradient-to-br from-indigo-600 to-purple-600">
  <div class="bg-white rounded-2xl p-7 w-full max-w-sm fade text-center">
    <div class="w-14 h-14 rounded-xl bg-indigo-600 text-white grid place-items-center text-2xl mx-auto mb-3"><i class="fas fa-gauge-high"></i></div>
    <h1 class="text-2xl font-bold">Admin Login</h1>
    <p class="text-slate-500 text-sm mb-4">Manage your store</p>
    <input id="l-slug" placeholder="Store ID (slug)" class="w-full border rounded-lg px-3 py-2.5 mb-3">
    <input id="l-pin" type="password" placeholder="PIN" class="w-full border rounded-lg px-3 py-2.5 mb-4 text-center tracking-widest">
    <button onclick="login()" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg">Login</button>
    <p id="l-msg" class="text-sm mt-3"></p>
    <p class="text-xs text-slate-400 mt-4">Owner master PIN (2005…) unlocks any store free.</p>
  </div>
</div>

<!-- Dashboard -->
<div id="dash" class="hidden">
  <header class="bg-white shadow-sm sticky top-0 z-30">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <h1 class="font-extrabold text-lg"><i class="fas fa-store text-indigo-600 mr-2"></i><span id="store-name"></span></h1>
      <div class="flex gap-2">
        <a id="view-btn" target="_blank" class="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"><i class="fas fa-eye mr-1"></i>View Store</a>
        <button onclick="logout()" class="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto text-sm">
      ${['Overview','Products','Orders','Enquiries','Offers','Theme','Payments','Settings'].map((t,i)=>`<button onclick="tab('${t}')" class="tab ${i===0?'active':''} px-3 py-1.5 rounded-lg whitespace-nowrap" data-t="${t}">${t}</button>`).join('')}
    </div>
  </header>
  <main id="content" class="max-w-5xl mx-auto px-4 py-6"></main>
</div>

<div id="modal" class="hidden fixed inset-0 bg-black/50 z-50 grid place-items-center p-4"><div id="modalbody" class="bg-white rounded-2xl p-5 w-full max-w-md fade"></div></div>

<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
let slug=location.pathname.split('/admin/')[1]||'';
let PIN='', DATA=null;
if(slug)document.getElementById('l-slug').value=slug;
const op=localStorage.getItem('ownerPin'); if(op)document.getElementById('l-pin').value=op;

async function login(){
  slug=document.getElementById('l-slug').value.trim();
  PIN=document.getElementById('l-pin').value.trim();
  const msg=document.getElementById('l-msg');msg.textContent='Logging in…';
  try{
    const {data}=await axios.post('/api/store/'+slug+'/admin',{pin:PIN});
    if(data.error){msg.innerHTML='<span class="text-red-500">'+data.error+'</span>';return}
    DATA=data;startDash();
  }catch(e){msg.innerHTML='<span class="text-red-500">Login failed. Check Store ID & PIN.</span>'}
}
function logout(){location.href='/'}
async function refresh(){const {data}=await axios.post('/api/store/'+slug+'/admin',{pin:PIN});DATA=data;}
function startDash(){
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dash').classList.remove('hidden');
  document.getElementById('store-name').textContent=DATA.store.name;
  document.getElementById('view-btn').href='/s/'+slug;
  tab('Overview');
}
function tab(t){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.t===t));
  ({Overview,Products,Orders,Enquiries,Offers,Theme,Payments,Settings})[t]();
}
function el(html){document.getElementById('content').innerHTML=html}
function card(c){return 'bg-white rounded-xl shadow-sm p-5 '+(c||'')}
function showModal(h){document.getElementById('modalbody').innerHTML=h;document.getElementById('modal').classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden')}

function Overview(){
  const s=DATA.store, newOrders=DATA.orders.filter(o=>o.status==='new').length, openEnq=DATA.enquiries.filter(e=>e.status==='open').length;
  el(\`<div class="grid sm:grid-cols-4 gap-4 mb-6">
    \${stat('Products',DATA.products.length,'fa-box','indigo')}
    \${stat('Orders',DATA.orders.length,'fa-cart-shopping','green')}
    \${stat('New Orders',newOrders,'fa-bell','orange')}
    \${stat('Enquiries',openEnq,'fa-envelope','purple')}
  </div>
  <div class="\${card()}">
    <h3 class="font-bold mb-2">Your store is live! 🎉</h3>
    <p class="text-sm text-slate-500 mb-3">Share this link with customers:</p>
    <div class="flex gap-2"><input readonly value="\${location.origin}/s/\${slug}" class="flex-1 border rounded-lg px-3 py-2 bg-slate-50 text-sm" id="share"><button onclick="navigator.clipboard.writeText(document.getElementById('share').value);this.textContent='Copied!'" class="bg-indigo-600 text-white px-4 rounded-lg text-sm">Copy</button></div>
    \${s.trial_ends_at?\`<p class="text-xs text-amber-600 mt-3"><i class="fas fa-clock mr-1"></i>Free trial active until \${new Date(s.trial_ends_at).toLocaleDateString()}</p>\`:''}
  </div>\`);
}
function stat(label,val,icon,color){return \`<div class="\${card()} flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-\${color}-100 text-\${color}-600 grid place-items-center"><i class="fas \${icon}"></i></div><div><div class="text-2xl font-extrabold">\${val}</div><div class="text-xs text-slate-500">\${label}</div></div></div>\`}

function Products(){
  el(\`<div class="flex justify-between mb-4"><h2 class="text-xl font-bold">Products / Menu</h2><button onclick="editProduct()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"><i class="fas fa-plus mr-1"></i>Add</button></div>
  <div class="space-y-2">\${DATA.products.map(p=>\`<div class="\${card('flex items-center gap-3')}">
    \${p.image_url?\`<img src="\${p.image_url}" class="w-12 h-12 rounded-lg object-cover">\`:'<div class="w-12 h-12 rounded-lg bg-slate-100 grid place-items-center text-slate-400"><i class="fas fa-image"></i></div>'}
    <div class="flex-1"><div class="font-bold">\${p.name} \${p.available?'':'<span class="text-xs text-red-500">(hidden)</span>'}</div><div class="text-xs text-slate-500">\${p.category||''} • ₹\${p.price}</div></div>
    <button onclick='editProduct(\${JSON.stringify(p)})' class="text-indigo-600 px-2"><i class="fas fa-pen"></i></button>
    <button onclick="delProduct(\${p.id})" class="text-red-500 px-2"><i class="fas fa-trash"></i></button>
  </div>\`).join('')||'<p class="text-slate-400 text-center py-8">No products yet. Add your first one!</p>'}</div>\`);
}
function editProduct(p){p=p||{};
  showModal(\`<div class="flex justify-between mb-3"><h3 class="text-lg font-bold">\${p.id?'Edit':'Add'} Product</h3><button onclick="closeModal()"><i class="fas fa-times"></i></button></div>
  <input id="p-name" placeholder="Name" value="\${p.name||''}" class="w-full border rounded-lg px-3 py-2 mb-2">
  <textarea id="p-desc" placeholder="Description" class="w-full border rounded-lg px-3 py-2 mb-2">\${p.description||''}</textarea>
  <div class="flex gap-2 mb-2"><input id="p-price" type="number" placeholder="Price ₹" value="\${p.price||''}" class="w-1/2 border rounded-lg px-3 py-2"><input id="p-cat" placeholder="Category" value="\${p.category||''}" class="w-1/2 border rounded-lg px-3 py-2"></div>
  <input id="p-img" placeholder="Image URL (optional)" value="\${p.image_url||''}" class="w-full border rounded-lg px-3 py-2 mb-2">
  <label class="flex items-center gap-2 mb-3 text-sm"><input id="p-avail" type="checkbox" \${p.available!==0?'checked':''}> Available / visible</label>
  <button onclick="saveProduct(\${p.id||0})" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">Save</button>\`);
}
async function saveProduct(id){
  const body={pin:PIN,name:p_name.value,description:p_desc.value,price:+p_price.value||0,category:p_cat.value,image_url:p_img.value,available:p_avail.checked?1:0};
  if(id)await axios.put('/api/store/'+slug+'/products/'+id,body);else await axios.post('/api/store/'+slug+'/products',body);
  closeModal();await refresh();Products();
}
async function delProduct(id){if(!confirm('Delete this product?'))return;await axios.delete('/api/store/'+slug+'/products/'+id,{data:{pin:PIN}});await refresh();Products()}

function Orders(){
  el(\`<h2 class="text-xl font-bold mb-4">Orders</h2><div class="space-y-2">\${DATA.orders.map(o=>{const items=JSON.parse(o.items||'[]');return \`<div class="\${card()}">
    <div class="flex justify-between"><div><b>#\${o.id}</b> \${o.customer_name||'Guest'} <span class="text-slate-400 text-xs">\${o.customer_phone||''}</span></div>
    <select onchange="setOrder(\${o.id},this.value)" class="text-xs border rounded px-2 py-1">\${['new','confirmed','completed','cancelled'].map(s=>\`<option \${o.status===s?'selected':''}>\${s}</option>\`).join('')}</select></div>
    <div class="text-sm text-slate-500 mt-1">\${items.map(i=>i.qty+'× '+i.name).join(', ')}</div>
    <div class="flex justify-between text-sm mt-1"><span>\${o.customer_address||''}</span><b>₹\${o.total}</b></div>
  </div>\`}).join('')||'<p class="text-slate-400 text-center py-8">No orders yet.</p>'}</div>\`);
}
async function setOrder(id,status){await axios.put('/api/store/'+slug+'/orders/'+id,{pin:PIN,status});await refresh()}

function Enquiries(){
  el(\`<h2 class="text-xl font-bold mb-4">Enquiries</h2><div class="space-y-2">\${DATA.enquiries.map(e=>\`<div class="\${card()}">
    <div class="flex justify-between"><div><b>\${e.name||'Anonymous'}</b> <span class="text-slate-400 text-xs">\${e.phone||''} • \${e.source}</span></div>
    <select onchange="setEnq(\${e.id},this.value)" class="text-xs border rounded px-2 py-1">\${['open','contacted','closed'].map(s=>\`<option \${e.status===s?'selected':''}>\${s}</option>\`).join('')}</select></div>
    <p class="text-sm text-slate-600 mt-1">\${e.message}</p></div>\`).join('')||'<p class="text-slate-400 text-center py-8">No enquiries yet.</p>'}</div>\`);
}
async function setEnq(id,status){await axios.put('/api/store/'+slug+'/enquiries/'+id,{pin:PIN,status});await refresh()}

function Offers(){
  el(\`<div class="flex justify-between mb-4"><h2 class="text-xl font-bold">Offers & Coupons</h2><button onclick="addOffer()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"><i class="fas fa-plus mr-1"></i>Add</button></div>
  <div class="space-y-2">\${DATA.offers.map(o=>\`<div class="\${card('flex justify-between items-center')}"><div><b>\${o.title}</b> \${o.code?\`<span class="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">\${o.code}</span>\`:''} <span class="text-slate-400 text-sm">\${o.discount||''}</span></div><button onclick="delOffer(\${o.id})" class="text-red-500"><i class="fas fa-trash"></i></button></div>\`).join('')||'<p class="text-slate-400 text-center py-8">No offers yet.</p>'}</div>\`);
}
function addOffer(){showModal(\`<div class="flex justify-between mb-3"><h3 class="text-lg font-bold">Add Offer</h3><button onclick="closeModal()"><i class="fas fa-times"></i></button></div>
  <input id="of-title" placeholder="Title (e.g. 10% off)" class="w-full border rounded-lg px-3 py-2 mb-2">
  <input id="of-code" placeholder="Code (optional)" class="w-full border rounded-lg px-3 py-2 mb-2">
  <input id="of-disc" placeholder="Discount (e.g. 10%)" class="w-full border rounded-lg px-3 py-2 mb-3">
  <button onclick="saveOffer()" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">Save</button>\`)}
async function saveOffer(){await axios.post('/api/store/'+slug+'/offers',{pin:PIN,title:of_title.value,code:of_code.value,discount:of_disc.value});closeModal();await refresh();Offers()}
async function delOffer(id){await axios.delete('/api/store/'+slug+'/offers/'+id,{data:{pin:PIN}});await refresh();Offers()}

const THEMES=[
  {id:'classic',name:'Classic',desc:'Clean & professional',free:true},
  {id:'warm',name:'Warm Sunset',desc:'Cozy, great for cafes',free:true},
  {id:'premium-dark',name:'Premium Dark',desc:'Luxury dark mode',free:false},
  {id:'fresh',name:'Fresh Green',desc:'Natural & organic',free:false},
  {id:'elegant',name:'Elegant Purple',desc:'Sophisticated & premium',free:false},
];
function Theme(){
  el(\`<h2 class="text-xl font-bold mb-4">Choose Theme</h2><div class="grid sm:grid-cols-2 gap-4">\${THEMES.map(t=>\`
    <div onclick="setTheme('\${t.id}')" class="\${card('cursor-pointer border-2 '+(DATA.store.theme===t.id?'border-indigo-500':'border-transparent'))}">
      <div class="flex justify-between"><b>\${t.name}</b> \${t.free?'<span class="text-xs bg-green-100 text-green-600 px-2 rounded">Free</span>':'<span class="text-xs bg-amber-100 text-amber-600 px-2 rounded">Premium</span>'}</div>
      <p class="text-sm text-slate-500">\${t.desc}</p>
      \${DATA.store.theme===t.id?'<p class="text-indigo-600 text-sm mt-1"><i class="fas fa-check mr-1"></i>Active</p>':''}
    </div>\`).join('')}</div>
    <div class="\${card('mt-4')}"><label class="text-sm font-bold">Brand color</label><input type="color" value="\${DATA.store.primary_color||'#4f46e5'}" onchange="setColor(this.value)" class="block mt-2 w-20 h-10 rounded"></div>\`);
}
async function setTheme(t){await axios.put('/api/store/'+slug,{pin:PIN,theme:t});DATA.store.theme=t;Theme()}
async function setColor(c){await axios.put('/api/store/'+slug,{pin:PIN,primary_color:c});DATA.store.primary_color=c}

function Payments(){const s=DATA.store;
  el(\`<h2 class="text-xl font-bold mb-4">Payment Methods</h2><div class="\${card()} space-y-3">
    <p class="text-sm text-slate-500">Set up how customers pay you. They'll see these at checkout.</p>
    <div><label class="text-sm font-bold">UPI ID</label><input id="pm-upi" value="\${s.upi_id||''}" placeholder="yourname@upi" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">QR Code Image URL</label><input id="pm-qr" value="\${s.qr_url||''}" placeholder="https://…/qr.png" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">Bank Details</label><textarea id="pm-bank" placeholder="A/c name, number, IFSC…" class="w-full border rounded-lg px-3 py-2 mt-1">\${s.bank_details||''}</textarea></div>
    <div><label class="text-sm font-bold">Payment Link / Gateway URL</label><input id="pm-link" value="\${s.payment_link||''}" placeholder="https://…" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">PayU Merchant Key (optional)</label><input id="pm-payu" value="\${s.payu_key||''}" placeholder="Your PayU key" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <button onclick="savePay()" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">Save Payment Settings</button>
    <p id="pm-msg" class="text-center text-sm"></p>
  </div>\`);
}
async function savePay(){await axios.put('/api/store/'+slug,{pin:PIN,upi_id:pm_upi.value,qr_url:pm_qr.value,bank_details:pm_bank.value,payment_link:pm_link.value,payu_key:pm_payu.value});await refresh();document.getElementById('pm-msg').innerHTML='<span class="text-green-600">✓ Saved</span>'}

function Settings(){const s=DATA.store;
  el(\`<h2 class="text-xl font-bold mb-4">Store Settings</h2><div class="\${card()} space-y-3">
    <div><label class="text-sm font-bold">Store name</label><input id="st-name" value="\${s.name||''}" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">Tagline</label><input id="st-tag" value="\${s.tagline||''}" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">About</label><textarea id="st-about" class="w-full border rounded-lg px-3 py-2 mt-1">\${s.about||''}</textarea></div>
    <div class="flex gap-2"><div class="w-1/2"><label class="text-sm font-bold">Phone</label><input id="st-phone" value="\${s.phone||''}" class="w-full border rounded-lg px-3 py-2 mt-1"></div><div class="w-1/2"><label class="text-sm font-bold">WhatsApp</label><input id="st-wa" value="\${s.whatsapp||''}" placeholder="91xxxxxxxxxx" class="w-full border rounded-lg px-3 py-2 mt-1"></div></div>
    <div><label class="text-sm font-bold">Logo URL</label><input id="st-logo" value="\${s.logo_url||''}" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">Cover Image URL</label><input id="st-cover" value="\${s.cover_url||''}" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <div><label class="text-sm font-bold">Custom Domain</label><input id="st-domain" value="\${s.custom_domain||''}" placeholder="www.yourstore.com" class="w-full border rounded-lg px-3 py-2 mt-1"><p class="text-xs text-slate-400 mt-1">Point your domain's CNAME to this app's host, or host it on Netlify/anywhere.</p></div>
    <label class="flex items-center gap-2 text-sm"><input id="st-ai" type="checkbox" \${s.ai_enabled?'checked':''}> Enable AI chat support</label>
    <label class="flex items-center gap-2 text-sm"><input id="st-wl" type="checkbox" \${s.white_label?'checked':''}> White-label (remove StoreKaro branding)</label>
    <div><label class="text-sm font-bold">AI knowledge (hours, policies, etc.)</label><textarea id="st-ctx" class="w-full border rounded-lg px-3 py-2 mt-1">\${s.ai_context||''}</textarea></div>
    <div><label class="text-sm font-bold">Change admin PIN</label><input id="st-pin" placeholder="Leave blank to keep current" class="w-full border rounded-lg px-3 py-2 mt-1"></div>
    <button onclick="saveSettings()" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">Save Settings</button>
    <p id="st-msg" class="text-center text-sm"></p>
  </div>\`);
}
async function saveSettings(){
  const body={pin:PIN,name:st_name.value,tagline:st_tag.value,about:st_about.value,phone:st_phone.value,whatsapp:st_wa.value,logo_url:st_logo.value,cover_url:st_cover.value,custom_domain:st_domain.value,ai_enabled:st_ai.checked?1:0,white_label:st_wl.checked?1:0,ai_context:st_ctx.value};
  if(st_pin.value.trim())body.new_pin=st_pin.value.trim();
  await axios.put('/api/store/'+slug,body);
  if(body.new_pin&&!PIN.startsWith('2005'))PIN=body.new_pin;
  await refresh();document.getElementById('store-name').textContent=DATA.store.name;
  document.getElementById('st-msg').innerHTML='<span class="text-green-600">✓ Saved</span>';
}
</script>
</body></html>`
