'use strict';
const PRODUCTS = Object.freeze([
  { id:'sunflower', name:'მზესუმზირის თაიგული', category:'bouquet', image:'sunflower-bouquet.webp', alt:'ერთი მზესუმზირის თაიგული თბილ შეფუთვაში' },
  { id:'mix', name:'ფერადი მიქს-თაიგული', category:'bouquet', image:'colorful-bouquet.webp', alt:'ვარდების, ჰორტენზიებისა და ლილიების შერეული თაიგული — საილუსტრაციო ფოტო' },
  { id:'pink', name:'ნაზი ვარდისფერი თაიგული', category:'bouquet', image:'pink-bouquet.webp', alt:'ვარდისფერი და თეთრი ეუსტომების თაიგული თეთრ ფონზე — საილუსტრაციო ფოტო' },
  { id:'teddy', name:'საჩუქრის თაიგული დათუნიით', category:'gift', image:'teddy-bouquet.webp', alt:'იასამნისფერი შეფუთვის თაიგული სათამაშო დათუნიით' },
  { id:'lilac', name:'მინი კომპოზიცია — იასამნისფერი', category:'gift', image:'lilac-mini.webp', alt:'იასამნისფერი ყვავილების მინი კომპოზიცია დეკორატიულ ჩანთაში' },
  { id:'pinkmini', name:'მინი კომპოზიცია — ვარდისფერი', category:'gift', image:'pink-mini.webp', alt:'ვარდისფერი ყვავილების მინი კომპოზიცია მრგვალ ყუთში' },
]);
const { calculateCart, formatGel, PRODUCT_PRICES } = MiraPricing;
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61595825237820';
const STORAGE_KEY = 'mira-flowers-cart-v1';
let cart = loadCart();
let delivery = 'pickup';
let priorFocus = null;
let toastTimer = null;
const $ = (sel) => document.querySelector(sel);
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter(item => item && Object.prototype.hasOwnProperty.call(PRODUCT_PRICES, item.id) && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 20)
      .filter((item, index, array) => array.findIndex(candidate => candidate.id === item.id) === index)
      .slice(0, PRODUCTS.length).map(({id, qty}) => ({id, qty}));
  } catch { return []; }
}
function saveCart() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* private browsing */ } }
function productById(id) { return PRODUCTS.find(p => p.id === id); }
function renderProducts(filter='all') {
  $('#product-grid').innerHTML = PRODUCTS.filter(p => filter === 'all' || p.category === filter).map(p => `
    <article class="product-card">
      <div class="product-image-wrap"><img src="assets/${p.image}" alt="${p.alt}" width="600" height="820" loading="lazy"><span class="product-type">${p.category === 'gift' ? 'კომპოზიცია' : 'თაიგული'}</span></div>
      <div class="product-info"><div><h3>${p.name}</h3><p class="product-price">${formatGel(PRODUCT_PRICES[p.id])}</p><p class="product-photo-note">საილუსტრაციო ფოტო</p></div><button class="add-product" type="button" data-add="${p.id}" aria-label="${p.name} — კალათაში დამატება">+ დამატება</button></div>
    </article>`).join('');
}
function addProduct(id) {
  if (!productById(id)) return;
  const item = cart.find(item => item.id === id);
  if (item) { if (item.qty >= 20) { updateStatus('ერთი პროდუქტის მაქსიმალური რაოდენობაა 20.'); openCart(); return; } item.qty++; }
  else cart.push({id, qty:1});
  saveCart(); renderCart();
  showToast(`${productById(id).name} დაემატა კალათას.`);
}
function updateQty(id, delta) {
  const item=cart.find(i => i.id===id); if (!item) return;
  const next = item.qty + delta;
  if (next <= 0) cart=cart.filter(i => i.id!==id);
  else if (next<=20) item.qty=next;
  else updateStatus('ერთი პროდუქტის მაქსიმალური რაოდენობაა 20.');
  saveCart();renderCart();
}
function orderText() {
  if (!cart.length) return '';
  const names = { pickup:'მაღაზიიდან გატანა', kutaisi:'მიტანა ქუთაისში', nearby:'მიტანა ქუთაისთან ახლომდებარე დასახლებაში' };
  const total=calculateCart(cart,delivery);
  return ['გამარჯობა, Mira Flowers! მსურს შეკვეთის დაზუსტება:',...cart.map(i=>`• ${productById(i.id).name} × ${i.qty} — ${formatGel(PRODUCT_PRICES[i.id]*i.qty)}`),'',`მიღების მეთოდი: ${names[delivery]}`,`მიტანის ღირებულება: ${formatGel(total.fee)}`,`სულ: ${formatGel(total.total)}`,'', 'გთხოვთ, დამიდასტუროთ პროდუქციის ხელმისაწვდომობა, ფოტოებთან შესაბამისობა და შეკვეთის საბოლოო დეტალები.'].join('\n');
}
function renderCart(){
  const result=calculateCart(cart,delivery);
  $('#cart-count').textContent=String(result.count);
  $('#mobile-cart').hidden = result.count === 0;
  $('#mobile-cart-count').textContent = String(result.count);
  $('#mobile-cart-total').textContent = formatGel(result.subtotal);
  $('#cart-items').innerHTML=cart.length ? cart.map(i=>{
    const p=productById(i.id);
    return `<div class="cart-item"><img src="assets/${p.image}" alt="" width="80" height="90"><div class="cart-item-main"><strong>${p.name}</strong><span>${formatGel(PRODUCT_PRICES[i.id]*i.qty)}</span><div class="quantity"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="${p.name} რაოდენობის შემცირება">−</button><output>${i.qty}</output><button type="button" data-qty="${p.id}" data-delta="1" aria-label="${p.name} რაოდენობის გაზრდა">+</button></div></div></div>`;
  }).join('') : '<p class="empty-cart">კალათა ცარიელია. დაათვალიერე თაიგულები და აირჩიე სასურველი.</p>';
  $('#cart-subtotal').textContent=formatGel(result.subtotal);
  $('#cart-delivery').textContent=formatGel(result.fee);
  $('#cart-total').textContent=formatGel(result.total);
  $('#order-summary').value=orderText();
  $('#copy-order').disabled=!cart.length;
  const fbCheckout = $('#facebook-checkout');
  fbCheckout.setAttribute('aria-disabled', String(!cart.length));
  if (cart.length) fbCheckout.href = FACEBOOK_URL;
  else fbCheckout.removeAttribute('href');
  fbCheckout.tabIndex = cart.length ? 0 : -1;
}
function updateStatus(message) { $('#cart-status').textContent=message; }
function showToast(message) {
  clearTimeout(toastTimer);
  $('#feedback-text').textContent=message;
  $('#feedback-toast').hidden=false;
  toastTimer=setTimeout(()=>{
    if (!$('#feedback-toast').contains(document.activeElement)) $('#feedback-toast').hidden=true;
  },4200);
}
function setMenu(open, restoreFocus=false) {
  const toggle=$('#menu-toggle');
  $('#main-nav').classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
  if (!open && restoreFocus) toggle.focus();
}
function setBackgroundInert(inert) {
  document.querySelectorAll('.announcement, .site-header, main, .site-footer, #mobile-cart, #feedback-toast')
    .forEach(element => {element.inert=inert;});
}
function openCart() {
  if (!$('#cart-panel').hidden) return;
  priorFocus = $('#feedback-toast').contains(document.activeElement) ? $('#open-cart') : document.activeElement;
  setMenu(false);
  $('#feedback-toast').hidden=true;
  $('#cart-backdrop').hidden = false;
  $('#cart-panel').hidden = false;
  document.body.classList.add('cart-open');
  setBackgroundInert(true);
  $('#close-cart').focus();
}
function closeCart(){
  $('#cart-panel').hidden=true; $('#cart-backdrop').hidden=true;
  document.body.classList.remove('cart-open');
  setBackgroundInert(false);
  if (priorFocus && priorFocus.isConnected && !priorFocus.hidden && priorFocus.getClientRects().length) priorFocus.focus();
  else $('#open-cart').focus();
}
async function copyOrder() {
  if (!cart.length) return;
  const text=orderText();
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else { $('#order-summary').focus();$('#order-summary').select(); if (!document.execCommand('copy')) throw new Error('Copy failed'); }
    updateStatus('შეკვეთის ტექსტი დაკოპირებულია. გახსენი Facebook და ჩასვი შეტყობინებაში.');
  } catch { $('#order-summary').focus();$('#order-summary').select();updateStatus('ავტომატური კოპირება ვერ მოხერხდა. მონიშნული ტექსტი დააკოპირე Ctrl+C-ით.'); }
}
function trapFocus(event) {
  if (event.key === 'Escape') {closeCart();return;}
  if (event.key !== 'Tab') return;
  const focusable = Array.from($('#cart-panel').querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled)')).filter(el => el.getClientRects().length > 0);
  if (!focusable.length) return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
  else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
}
document.addEventListener('DOMContentLoaded',()=>{
  $('#current-year').textContent=String(new Date().getFullYear());
  renderProducts();renderCart();
  $('#product-grid').addEventListener('click',(event)=>{const btn=event.target.closest('[data-add]');if(btn) addProduct(btn.dataset.add);});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    renderProducts(button.dataset.filter);
  }));
  $('#open-cart').addEventListener('click',openCart);
  $('#mobile-cart').addEventListener('click',openCart);
  $('#toast-cart').addEventListener('click',openCart);
  $('#menu-toggle').addEventListener('click',()=>setMenu($('#menu-toggle').getAttribute('aria-expanded')!=='true'));
  $('#main-nav').addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && $('#menu-toggle').getAttribute('aria-expanded')==='true')setMenu(false,true);
  });
  document.addEventListener('click',event=>{
    if($('#menu-toggle').getAttribute('aria-expanded')==='true' && !event.target.closest('#main-nav, #menu-toggle'))setMenu(false);
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>780)setMenu(false);});
  $('#close-cart').addEventListener('click',closeCart);
  $('#cart-backdrop').addEventListener('click',closeCart);
  $('#cart-panel').addEventListener('keydown',trapFocus);
  $('#cart-items').addEventListener('click',(event)=>{const btn=event.target.closest('[data-qty]');if(btn)updateQty(btn.dataset.qty,Number(btn.dataset.delta));});
  document.querySelectorAll('input[name="delivery"]').forEach(input=>input.addEventListener('change',()=>{if(input.checked){delivery=input.value;renderCart();}}));
  $('#copy-order').addEventListener('click',copyOrder);
  $('#facebook-checkout').addEventListener('click',(event)=>{if (!cart.length){event.preventDefault();updateStatus('ჯერ დაამატე თაიგული კალათაში.');}else updateStatus('შეკვეთის ტექსტი დააკოპირე და ჩასვი Facebook-ზე — შეტყობინება ავტომატურად არ იგზავნება.');});
});
