export const storefrontPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Store</title>
<meta name="description" content="Browse our menu, place orders and connect with us.">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
[data-theme="premium-dark"]{--bg:#0f0f12;--card:#1c1c22;--text:#f4f4f5;--muted:#a1a1aa}
[data-theme="classic"]{--bg:#f8fafc;--card:#ffffff;--text:#1e293b;--muted:#64748b}
[data-theme="warm"]{--bg:#fffbeb;--card:#fff;--text:#451a03;--muted:#92400e}
[data-theme="fresh"]{--bg:#f0fdf4;--card:#fff;--text:#14532d;--muted:#16a34a}
[data-theme="elegant"]{--bg:#faf5ff;--card:#fff;--text:#3b0764;--muted:#7e22ce}
body{background:var(--bg);color:var(--text)}
.card{background:var(--card)}
.muted{color:var(--muted)}
.fade{animation:f .5s ease both}@keyframes f{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
</style>
</head>
<body data-theme="classic" class="min-h-screen pb-24">
<div id="app" class="max-w-2xl mx-auto"><p class="text-center p-10 muted">Loading store…</p></div>

<!-- Cart bar -->
<div id="cartbar" class="hidden fixed bottom-0 inset-x-0 z-30">
  <div class="max-w-2xl mx-auto p-3">
    <button onclick="openCart()" class="w-full text-white font-bold py-3.5 rounded-xl shadow-2xl flex justify-between px-5" id="cartbtn">
      <span><i class="fas fa-cart-shopping mr-2"></i><span id="cart-count">0</span> items</span>
      <span>₹<span id="cart-total">0</span> • View Cart</span>
    </button>
  </div>
</div>

<!-- AI chat button -->
<button id="chatbtn" onclick="toggleChat()" class="hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full text-white shadow-2xl text-xl"><i class="fas fa-comments"></i></button>

<!-- Chat panel -->
<div id="chat" class="hidden fixed bottom-24 right-4 z-40 w-80 max-w-[92vw] card rounded-2xl shadow-2xl flex flex-col" style="height:440px">
  <div class="p-3 rounded-t-2xl text-white flex justify-between items-center" id="chathead"><span class="font-bold"><i class="fas fa-robot mr-2"></i>AI Support</span><button onclick="toggleChat()"><i class="fas fa-times"></i></button></div>
  <div id="chatlog" class="flex-1 overflow-y-auto p-3 space-y-2 text-sm"></div>
  <div class="p-2 border-t flex gap-2"><input id="chatinput" onkeydown="if(event.key==='Enter')sendChat()" placeholder="Ask anything…" class="flex-1 border rounded-lg px-3 py-2 text-slate-800 text-sm"><button onclick="sendChat()" class="text-white px-3 rounded-lg" id="chatsend"><i class="fas fa-paper-plane"></i></button></div>
</div>

<!-- Modals container -->
<div id="modal" class="hidden fixed inset-0 bg-black/60 z-50 grid place-items-center p-4"><div id="modalbody" class="card rounded-2xl p-5 w-full max-w-md fade text-[color:var(--text)]"></div></div>

<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
const slug = location.pathname.split('/s/')[1];
let STORE=null, PRODUCTS=[], OFFERS=[], cart={}, accent='#4f46e5';
function rgb(c){return c}
async function load(){
  try{
    const {data}=await axios.get('/api/store/'+slug);
    STORE=data.store; PRODUCTS=data.products; OFFERS=data.offers; accent=STORE.primary_color||'#4f46e5';
    document.title=STORE.name;
    document.body.dataset.theme=STORE.theme||'classic';
    setAccent();
    render();
    if(STORE.ai_enabled){document.getElementById('chatbtn').classList.remove('hidden')}
  }catch(e){document.getElementById('app').innerHTML='<p class="text-center p-10 text-red-500">Store not found.</p>'}
}
function setAccent(){
  ['cartbtn','chatbtn','chathead','chatsend'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.background=accent});
}
function render(){
  const cats=[...new Set(PRODUCTS.map(p=>p.category||'Items'))];
  document.getElementById('app').innerHTML=\`
    <div class="relative">
      \${STORE.cover_url?\`<img src="\${STORE.cover_url}" class="w-full h-44 object-cover">\`:\`<div class="w-full h-32" style="background:\${accent}"></div>\`}
    </div>
    <div class="px-4 -mt-12 relative">
      <div class="card rounded-2xl shadow-lg p-5 text-center fade">
        \${STORE.logo_url?\`<img src="\${STORE.logo_url}" class="w-20 h-20 rounded-full object-cover mx-auto -mt-14 border-4 border-white shadow">\`:\`<div class="w-20 h-20 rounded-full mx-auto -mt-14 border-4 border-white shadow grid place-items-center text-white text-2xl font-bold" style="background:\${accent}">\${STORE.name[0]}</div>\`}
        <h1 class="text-2xl font-extrabold mt-2">\${STORE.name}</h1>
        \${STORE.tagline?\`<p class="muted text-sm mt-1">\${STORE.tagline}</p>\`:''}
        <div class="flex justify-center gap-3 mt-4 text-sm">
          \${STORE.whatsapp?\`<a href="https://wa.me/\${STORE.whatsapp}" class="px-3 py-1.5 rounded-lg bg-green-500 text-white"><i class="fab fa-whatsapp mr-1"></i>WhatsApp</a>\`:''}
          \${STORE.phone?\`<a href="tel:\${STORE.phone}" class="px-3 py-1.5 rounded-lg" style="background:\${accent};color:#fff"><i class="fas fa-phone mr-1"></i>Call</a>\`:''}
          <button onclick="openEnquiry()" class="px-3 py-1.5 rounded-lg border" style="border-color:\${accent};color:\${accent}"><i class="fas fa-envelope mr-1"></i>Enquiry</button>
        </div>
      </div>
      \${OFFERS.length?\`<div class="mt-4 space-y-2">\${OFFERS.map(o=>\`<div class="rounded-xl p-3 text-white text-sm flex items-center gap-2" style="background:\${accent}"><i class="fas fa-tag"></i><b>\${o.title}</b>\${o.code?\`<span class="ml-auto bg-white/25 px-2 py-0.5 rounded font-mono">\${o.code}</span>\`:''}</div>\`).join('')}</div>\`:''}
      \${STORE.about?\`<p class="muted text-sm mt-4 text-center">\${STORE.about}</p>\`:''}
    </div>
    <div class="px-4 mt-6">
      \${cats.map(cat=>\`
        <h2 class="text-lg font-bold mt-5 mb-2">\${cat}</h2>
        <div class="space-y-3">
          \${PRODUCTS.filter(p=>(p.category||'Items')===cat).map(p=>\`
            <div class="card rounded-xl p-3 flex gap-3 shadow-sm fade">
              \${p.image_url?\`<img src="\${p.image_url}" class="w-20 h-20 rounded-lg object-cover">\`:''}
              <div class="flex-1">
                <h3 class="font-bold">\${p.name}</h3>
                <p class="muted text-xs">\${p.description||''}</p>
                <div class="font-bold mt-1">₹\${p.price}</div>
              </div>
              <div class="flex items-center">\${cartCtrl(p)}</div>
            </div>\`).join('')}
        </div>\`).join('')}
      \${PRODUCTS.length===0?'<p class="muted text-center py-8">No items added yet.</p>':''}
    </div>
    <div class="text-center muted text-xs mt-10">\${STORE.white_label?'':'Powered by <b>StoreKaro</b>'}</div>\`;
  updateCartBar();
}
function cartCtrl(p){
  const q=cart[p.id]?.qty||0;
  if(q===0)return \`<button onclick="addCart(\${p.id})" class="text-white text-sm font-bold px-3 py-1.5 rounded-lg" style="background:\${accent}">Add +</button>\`;
  return \`<div class="flex items-center gap-2"><button onclick="addCart(\${p.id},-1)" class="w-7 h-7 rounded-full border">−</button><b>\${q}</b><button onclick="addCart(\${p.id},1)" class="w-7 h-7 rounded-full text-white" style="background:\${accent}">+</button></div>\`;
}
function addCart(id,d=1){
  const p=PRODUCTS.find(x=>x.id===id);
  const q=(cart[id]?.qty||0)+d;
  if(q<=0)delete cart[id];else cart[id]={...p,qty:q};
  render();
}
function cartTotal(){return Object.values(cart).reduce((s,i)=>s+i.price*i.qty,0)}
function cartCount(){return Object.values(cart).reduce((s,i)=>s+i.qty,0)}
function updateCartBar(){
  const bar=document.getElementById('cartbar');
  if(cartCount()>0){bar.classList.remove('hidden');document.getElementById('cart-count').textContent=cartCount();document.getElementById('cart-total').textContent=cartTotal()}
  else bar.classList.add('hidden');
}
function showModal(html){document.getElementById('modalbody').innerHTML=html;document.getElementById('modal').classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
function openCart(){
  if(cartCount()===0)return;
  showModal(\`<div class="flex justify-between mb-3"><h3 class="text-xl font-bold">Your Order</h3><button onclick="closeModal()"><i class="fas fa-times"></i></button></div>
    <div class="space-y-2 mb-3 max-h-48 overflow-y-auto">\${Object.values(cart).map(i=>\`<div class="flex justify-between text-sm"><span>\${i.qty}× \${i.name}</span><span>₹\${i.price*i.qty}</span></div>\`).join('')}</div>
    <div class="flex justify-between font-bold border-t pt-2 mb-3">Total <span>₹\${cartTotal()}</span></div>
    <input id="o-name" placeholder="Your name" class="w-full border rounded-lg px-3 py-2 mb-2 text-slate-800">
    <input id="o-phone" placeholder="Phone number" class="w-full border rounded-lg px-3 py-2 mb-2 text-slate-800">
    <input id="o-addr" placeholder="Address (optional)" class="w-full border rounded-lg px-3 py-2 mb-3 text-slate-800">
    <button onclick="placeOrder()" class="w-full text-white font-bold py-3 rounded-lg" style="background:\${accent}">Place Order</button>
    \${paymentInfo()}
    <p id="o-msg" class="text-center text-sm mt-2"></p>\`);
}
function paymentInfo(){
  let h='';
  if(STORE.upi_id||STORE.qr_url||STORE.bank_details||STORE.payment_link){
    h='<div class="mt-4 border-t pt-3 text-sm"><p class="font-bold mb-2">Payment options:</p>';
    if(STORE.upi_id)h+=\`<p class="mb-1"><i class="fas fa-mobile-screen mr-1"></i>UPI: <b>\${STORE.upi_id}</b></p>\`;
    if(STORE.qr_url)h+=\`<img src="\${STORE.qr_url}" class="w-32 mx-auto my-2 rounded-lg">\`;
    if(STORE.bank_details)h+=\`<p class="muted whitespace-pre-line">\${STORE.bank_details}</p>\`;
    if(STORE.payment_link)h+=\`<a href="\${STORE.payment_link}" target="_blank" class="block text-center mt-2 underline" style="color:\${accent}">Pay online →</a>\`;
    h+='</div>';
  }
  return h;
}
async function placeOrder(){
  const items=Object.values(cart).map(i=>({name:i.name,qty:i.qty,price:i.price}));
  const msg=document.getElementById('o-msg');msg.textContent='Placing…';
  try{
    await axios.post('/api/store/'+slug+'/orders',{customer_name:document.getElementById('o-name').value,customer_phone:document.getElementById('o-phone').value,customer_address:document.getElementById('o-addr').value,items,total:cartTotal()});
    msg.innerHTML='<span class="text-green-600 font-bold">✓ Order placed! We will contact you.</span>';
    cart={};setTimeout(()=>{closeModal();render()},1800);
  }catch(e){msg.innerHTML='<span class="text-red-500">Failed, try again</span>'}
}
function openEnquiry(){
  showModal(\`<div class="flex justify-between mb-3"><h3 class="text-xl font-bold">Send Enquiry</h3><button onclick="closeModal()"><i class="fas fa-times"></i></button></div>
    <input id="e-name" placeholder="Your name" class="w-full border rounded-lg px-3 py-2 mb-2 text-slate-800">
    <input id="e-phone" placeholder="Phone" class="w-full border rounded-lg px-3 py-2 mb-2 text-slate-800">
    <textarea id="e-msg" placeholder="Your message…" rows="3" class="w-full border rounded-lg px-3 py-2 mb-3 text-slate-800"></textarea>
    <button onclick="sendEnquiry()" class="w-full text-white font-bold py-3 rounded-lg" style="background:\${accent}">Send</button>
    <p id="e-status" class="text-center text-sm mt-2"></p>\`);
}
async function sendEnquiry(){
  const st=document.getElementById('e-status');st.textContent='Sending…';
  try{
    await axios.post('/api/store/'+slug+'/enquiries',{name:document.getElementById('e-name').value,phone:document.getElementById('e-phone').value,message:document.getElementById('e-msg').value});
    st.innerHTML='<span class="text-green-600 font-bold">✓ Sent! We will reach out soon.</span>';
    setTimeout(closeModal,1600);
  }catch(e){st.innerHTML='<span class="text-red-500">Failed</span>'}
}
// AI chat
let chatStarted=false;
function toggleChat(){const c=document.getElementById('chat');c.classList.toggle('hidden');
  if(!chatStarted){chatStarted=true;addMsg('bot','Hi! 👋 I am the AI assistant for '+STORE.name+'. How can I help you today?')}}
function addMsg(who,txt){
  const log=document.getElementById('chatlog');
  log.innerHTML+=who==='bot'?\`<div class="flex"><div class="bg-slate-200 text-slate-800 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">\${txt}</div></div>\`:\`<div class="flex justify-end"><div class="text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]" style="background:\${accent}">\${txt}</div></div>\`;
  log.scrollTop=log.scrollHeight;
}
async function sendChat(){
  const inp=document.getElementById('chatinput');const t=inp.value.trim();if(!t)return;
  addMsg('me',t);inp.value='';addMsg('bot','<i class="fas fa-spinner fa-spin"></i>');
  try{const {data}=await axios.post('/api/store/'+slug+'/chat',{message:t});
    document.getElementById('chatlog').lastChild.remove();addMsg('bot',data.reply);
  }catch(e){document.getElementById('chatlog').lastChild.remove();addMsg('bot','Sorry, please try again or send an enquiry.')}
}
load();
</script>
</body></html>`
