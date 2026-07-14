/* ═══════════════════════════════════════════════════════════════
   VASTRA — Threads of the Himalaya
   Cinematic 3D scroll scene (Three.js) + full shop simulation.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ────────────────────────── helpers ─────────────────────────── */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const NPR = n => 'रू ' + n.toLocaleString('en-IN');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ────────────────────────── catalog ─────────────────────────── */
const PRODUCTS = [
  {
    id: 'daura', name: 'Daura Suruwal', np: 'दौरा सुरुवाल', cat: 'men',
    price: 8500, sizes: ['S', 'M', 'L', 'XL'], pattern: 'diamond',
    hues: ['#8e1f1f', '#d93a32', '#e9a83c'],
    desc: 'The national dress, cut from handloomed cotton-dhaka. Eight sacred ties, no buttons — the closure alone takes a tailor half a day to place correctly.',
    notes: ['Handloom cotton-dhaka blend', 'Eight-string traditional closure', 'Made to order in Patan, 10 days'],
  },
  {
    id: 'topi', name: 'Dhaka Topi', np: 'ढाका टोपी', cat: 'accessories',
    price: 1250, sizes: ['S', 'M', 'L'], pattern: 'zigzag',
    hues: ['#1d1a42', '#d93a32', '#e9a83c'],
    desc: 'The hat of Palpa. Its geometry is counted directly into the weave from memory — no two topis from our looms carry the same constellation.',
    notes: ['Pure Palpali dhaka', 'Stiffened cotton crown', 'One-of-one pattern'],
  },
  {
    id: 'gunyu', name: 'Gunyu Cholo', np: 'गुन्यू चोलो', cat: 'women',
    price: 12400, sizes: ['S', 'M', 'L', 'XL'], pattern: 'temple',
    hues: ['#6d1330', '#c22b48', '#f3c877'],
    desc: 'A coming-of-age set: wrapped gunyu skirt and fitted cholo blouse in madder-dyed silk-cotton, edged in gold thread from Bhaktapur.',
    notes: ['Madder-root dyed silk-cotton', 'Hand-finished gold selvedge', 'Includes 4m wrap skirt + cholo'],
  },
  {
    id: 'haku', name: 'Haku Patasi', np: 'हाकु पटासी', cat: 'heritage',
    price: 9800, sizes: ['One Size'], pattern: 'stripe',
    hues: ['#131020', '#2a2438', '#d93a32'],
    desc: 'The black sari of the Newar valley, bordered in sindoor red. Woven on backstrap looms in Kirtipur exactly as it was five hundred years ago.',
    notes: ['Backstrap-loom black cotton', 'Sindoor red border', 'Woven in Kirtipur'],
  },
  {
    id: 'pashmina', name: 'Mustang Pashmina', np: 'पश्मिना', cat: 'accessories',
    price: 6900, sizes: ['One Size'], pattern: 'mountain',
    hues: ['#1b2a4a', '#3d66c9', '#f4ecdc'],
    desc: 'Combed each spring from chyangra goats above 4,000 metres. Diamond-twill woven, ring-test fine, warmer than anything its weight has a right to be.',
    notes: ['100% Grade-A chyangra pashmina', 'Diamond twill weave', '200 × 70 cm'],
  },
  {
    id: 'bakkhu', name: 'Bakkhu Robe', np: 'बख्खु', cat: 'heritage',
    price: 11500, sizes: ['M', 'L', 'XL'], pattern: 'weave',
    hues: ['#3a1c10', '#8a4a1f', '#e9a83c'],
    desc: 'The wrap-robe of the high Himalaya, in dense yak-wool twill. Cut generously to sleep in at altitude; belted to work in by day.',
    notes: ['Yak-wool twill, felted hem', 'Hand-braided patuka belt included', 'Wind-proof at 5,000 m'],
  },
  {
    id: 'bhoto', name: 'Festival Bhoto', np: 'भोटो', cat: 'heritage',
    price: 2600, sizes: ['S', 'M', 'L'], pattern: 'mandala',
    hues: ['#14304a', '#2e6a8e', '#f3c877'],
    desc: 'A vest in honour of the one shown at Bhoto Jatra. Jewelled motif embroidered at the chest, closed with braided cord.',
    notes: ['Quilted cotton body', 'Hand-embroidered chest motif', 'Braided cord closure'],
  },
  {
    id: 'blazer', name: 'Dhaka Blazer', np: 'ढाका ब्लेजर', cat: 'men',
    price: 14900, sizes: ['S', 'M', 'L', 'XL'], pattern: 'diamond',
    hues: ['#101c2a', '#1e3a54', '#e9a83c'],
    desc: 'Our heritage-fusion tailoring: a structured blazer with dhaka lapel facing and lining. Kathmandu on the outside, Palpa on the inside.',
    notes: ['Wool shell, dhaka facing', 'Half-canvas construction', 'Corozo buttons'],
  },
  {
    id: 'chaubandi', name: 'Chaubandi Cholo', np: 'चौबन्दी चोलो', cat: 'women',
    price: 7200, sizes: ['S', 'M', 'L'], pattern: 'zigzag',
    hues: ['#5a1638', '#a1275f', '#f3c877'],
    desc: 'The four-tie blouse of the hills, in double-dyed cotton flannel. Warm enough for a Mustang morning, bright enough for a wedding.',
    notes: ['Double-dyed cotton flannel', 'Four traditional side ties', 'Colourfast natural dye'],
  },
];

const CAT_LABEL = { men: 'Men', women: 'Women', heritage: 'Heritage', accessories: 'Accessories' };

/* ─────────────────── woven fabric SVG artwork ───────────────── */
function fabricSVG(p, uid) {
  const [a, b, c] = p.hues;
  const id = `${p.id}-${uid}`.replace(/[^a-zA-Z0-9_-]/g, '');
  let inner = '';

  if (p.pattern === 'diamond') {
    inner = `
    <pattern id="pt-${id}" width="56" height="72" patternUnits="userSpaceOnUse">
      <rect width="56" height="72" fill="${a}"/>
      <path d="M28 4 L52 36 L28 68 L4 36 Z" fill="${b}"/>
      <path d="M28 18 L41 36 L28 54 L15 36 Z" fill="${a}"/>
      <circle cx="28" cy="36" r="4.5" fill="${c}"/>
      <path d="M0 0 L8 0 M48 0 L56 0" stroke="${c}" stroke-width="2"/>
    </pattern>
    <rect width="400" height="500" fill="url(#pt-${id})"/>`;
  } else if (p.pattern === 'zigzag') {
    inner = `
    <pattern id="pt-${id}" width="80" height="52" patternUnits="userSpaceOnUse">
      <rect width="80" height="52" fill="${a}"/>
      <path d="M0 40 L20 14 L40 40 L60 14 L80 40 L80 52 L0 52 Z" fill="${b}"/>
      <path d="M0 32 L20 6 L40 32 L60 6 L80 32" fill="none" stroke="${c}" stroke-width="3.5"/>
      <circle cx="20" cy="46" r="2.4" fill="${c}"/><circle cx="60" cy="46" r="2.4" fill="${c}"/>
    </pattern>
    <rect width="400" height="500" fill="url(#pt-${id})"/>`;
  } else if (p.pattern === 'temple') {
    inner = `
    <pattern id="pt-${id}" width="76" height="88" patternUnits="userSpaceOnUse">
      <rect width="76" height="88" fill="${a}"/>
      <rect x="8"  y="58" width="60" height="9"  fill="${b}"/>
      <rect x="16" y="45" width="44" height="11" fill="${b}"/>
      <rect x="25" y="32" width="26" height="11" fill="${b}"/>
      <rect x="32" y="20" width="12" height="10" fill="${c}"/>
      <rect x="36" y="12" width="4"  height="7"  fill="${c}"/>
      <path d="M0 74 H76" stroke="${c}" stroke-width="2.5" stroke-dasharray="7 5"/>
    </pattern>
    <rect width="400" height="500" fill="url(#pt-${id})"/>`;
  } else if (p.pattern === 'stripe') {
    inner = `
    <pattern id="pt-${id}" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
      <rect width="64" height="64" fill="${a}"/>
      <rect x="0"  width="26" height="64" fill="${b}"/>
      <rect x="30" width="5"  height="64" fill="${c}"/>
      <rect x="40" width="2"  height="64" fill="${c}" opacity="0.6"/>
      <rect x="48" width="10" height="64" fill="${b}" opacity="0.55"/>
    </pattern>
    <rect width="400" height="500" fill="url(#pt-${id})"/>
    <rect x="0" y="440" width="400" height="60" fill="${c}"/>
    <rect x="0" y="430" width="400" height="4" fill="${a}"/>`;
  } else if (p.pattern === 'mountain') {
    inner = `
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/>
    </linearGradient>
    <rect width="400" height="500" fill="url(#sky-${id})"/>
    <circle cx="300" cy="110" r="46" fill="${c}" opacity="0.9"/>
    <polygon points="0,330 85,175 165,295 255,140 330,265 400,190 400,500 0,500" fill="${a}" opacity="0.85"/>
    <polygon points="255,140 285,190 268,188 245,205 232,178" fill="${c}" opacity="0.9"/>
    <polygon points="85,175 108,215 92,210 74,228 63,205" fill="${c}" opacity="0.8"/>
    <polygon points="0,410 120,300 240,395 340,320 400,370 400,500 0,500" fill="#0c0b1a" opacity="0.8"/>
    <path d="M0 460 H400 M0 478 H400" stroke="${c}" stroke-width="1.4" stroke-dasharray="3 8" opacity="0.7"/>`;
  } else if (p.pattern === 'mandala') {
    let rings = '';
    for (let i = 0; i < 12; i++) {
      const ang = i * 30;
      rings += `<ellipse cx="200" cy="230" rx="14" ry="52" fill="none" stroke="${c}" stroke-width="2.4" transform="rotate(${ang} 200 230)" opacity="0.85"/>`;
    }
    inner = `
    <rect width="400" height="500" fill="${a}"/>
    <circle cx="200" cy="230" r="150" fill="${b}" opacity="0.5"/>
    <circle cx="200" cy="230" r="118" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 9"/>
    ${rings}
    <circle cx="200" cy="230" r="26" fill="${c}"/>
    <circle cx="200" cy="230" r="12" fill="${a}"/>
    <path d="M20 452 H380 M20 470 H380" stroke="${c}" stroke-width="2.5" stroke-dasharray="14 10"/>`;
  } else { /* weave */
    inner = `
    <pattern id="pt-${id}" width="48" height="48" patternUnits="userSpaceOnUse">
      <rect width="48" height="48" fill="${a}"/>
      <rect x="0" y="0" width="24" height="24" fill="${b}"/>
      <rect x="24" y="24" width="24" height="24" fill="${b}"/>
      <path d="M0 24 H48 M24 0 V48" stroke="${c}" stroke-width="1.6" opacity="0.7"/>
      <circle cx="24" cy="24" r="3" fill="${c}"/>
    </pattern>
    <rect width="400" height="500" fill="url(#pt-${id})"/>`;
  }

  return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.name} fabric">
    <defs>
      <pattern id="wv-${id}" width="6" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 1 H6" stroke="#000" stroke-opacity="0.22" stroke-width="1"/>
        <path d="M0 4 H6" stroke="#fff" stroke-opacity="0.05" stroke-width="1"/>
      </pattern>
      <radialGradient id="vg-${id}" cx="0.5" cy="0.42" r="0.85">
        <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.42"/>
      </radialGradient>
    </defs>
    ${inner}
    <rect width="400" height="500" fill="url(#wv-${id})"/>
    <rect width="400" height="500" fill="url(#vg-${id})"/>
  </svg>`;
}

/* ─────────────────────── cart state ─────────────────────────── */
const CART_KEY = 'vastra-cart-v1';
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

const findProduct = id => PRODUCTS.find(p => p.id === id);
const cartCount = () => cart.reduce((n, it) => n + it.qty, 0);
const cartSubtotal = () => cart.reduce((n, it) => n + findProduct(it.id).price * it.qty, 0);
const FREE_SHIP_AT = 10000, SHIP_FLAT = 250;
const shipping = () => (cart.length === 0 || cartSubtotal() >= FREE_SHIP_AT) ? 0 : SHIP_FLAT;

function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

function addToCart(id, size, qty = 1) {
  const hit = cart.find(it => it.id === id && it.size === size);
  if (hit) hit.qty = clamp(hit.qty + qty, 1, 9);
  else cart.push({ id, size, qty });
  saveCart(); renderCartBadge(); renderDrawer();
  const p = findProduct(id);
  toast(`<b>${p.name}</b> · ${size} added to your bag`);
}

function setQty(id, size, qty) {
  const hit = cart.find(it => it.id === id && it.size === size);
  if (!hit) return;
  hit.qty = clamp(qty, 1, 9);
  saveCart(); renderCartBadge(); renderDrawer();
}

function removeItem(id, size) {
  cart = cart.filter(it => !(it.id === id && it.size === size));
  saveCart(); renderCartBadge(); renderDrawer();
}

function renderCartBadge() {
  const el = $('#cartCount');
  el.textContent = cartCount();
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}

/* ─────────────────────── toast ──────────────────────────────── */
let toastTimer;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ─────────────────── product grid + filters ─────────────────── */
function renderGrid(filter = 'all') {
  const grid = $('#productGrid');
  grid.innerHTML = '';
  const list = PRODUCTS.filter(p => filter === 'all' || p.cat === filter);
  list.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <button class="card-media" data-open="${p.id}" aria-label="View ${p.name}">
        ${fabricSVG(p, 'grid')}
        <span class="card-cat">${CAT_LABEL[p.cat]}</span>
        <span class="card-view">View · Select</span>
      </button>
      <div class="card-body">
        <div class="card-names"><h3>${p.name}</h3><span class="np">${p.np}</span></div>
        <span class="card-price">${NPR(p.price)}</span>
        <div class="sizes">${p.sizes.map((s, j) =>
          `<button class="size${j === 0 ? ' sel' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
        <button class="card-add" data-add="${p.id}">Add to Bag</button>
      </div>`;
    grid.appendChild(card);

    $$('.size', card).forEach(btn => btn.addEventListener('click', () => {
      $$('.size', card).forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    }));
    $('.card-add', card).addEventListener('click', e => {
      const size = ($('.size.sel', card) || {}).dataset?.size || p.sizes[0];
      addToCart(p.id, size);
      const btn = e.currentTarget;
      btn.classList.add('added'); btn.textContent = 'Added ✓';
      setTimeout(() => { btn.classList.remove('added'); btn.textContent = 'Add to Bag'; }, 1200);
    });
    $('.card-media', card).addEventListener('click', () => openProduct(p.id));
  });
}

$('#filters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  $$('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  renderGrid(chip.dataset.filter);
});

/* ─────────────────── product detail modal ───────────────────── */
let modalProduct = null, modalSize = null, modalQty = 1;

function openProduct(id) {
  const p = findProduct(id);
  modalProduct = p; modalSize = p.sizes[0]; modalQty = 1;
  $('#pmodalMedia').innerHTML = fabricSVG(p, 'modal');
  $('#pmodalCat').textContent = CAT_LABEL[p.cat] + ' · Handwoven';
  $('#pmodalName').textContent = p.name;
  $('#pmodalNp').textContent = p.np;
  $('#pmodalPrice').textContent = NPR(p.price);
  $('#pmodalDesc').textContent = p.desc;
  $('#pmodalNotes').innerHTML = p.notes.map(n => `<li>${n}</li>`).join('');
  $('#pmodalSizes').innerHTML = p.sizes.map((s, i) =>
    `<button class="size${i === 0 ? ' sel' : ''}" data-size="${s}">${s}</button>`).join('');
  $$('#pmodalSizes .size').forEach(btn => btn.addEventListener('click', () => {
    $$('#pmodalSizes .size').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel'); modalSize = btn.dataset.size;
  }));
  updateModalTotal();
  show($('#modalOverlay')); show($('#pmodal'));
}

function updateModalTotal() {
  $('#qtyVal').textContent = modalQty;
  $('#pmodalTotal').textContent = NPR(modalProduct.price * modalQty);
}
$('#qtyMinus').addEventListener('click', () => { modalQty = clamp(modalQty - 1, 1, 9); updateModalTotal(); });
$('#qtyPlus').addEventListener('click', () => { modalQty = clamp(modalQty + 1, 1, 9); updateModalTotal(); });
$('#pmodalAdd').addEventListener('click', () => {
  addToCart(modalProduct.id, modalSize, modalQty);
  closeProduct();
  openDrawer();
});
function closeProduct() { hide($('#pmodal')); hide($('#modalOverlay')); }
$('#pmodalClose').addEventListener('click', closeProduct);
$('#modalOverlay').addEventListener('click', closeProduct);

/* ───────────────── show/hide with transitions ───────────────── */
function show(el) {
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
}
function hide(el) {
  el.classList.remove('show');
  setTimeout(() => { el.hidden = true; }, 480);
}

/* ─────────────────────── cart drawer ────────────────────────── */
function openDrawer() { renderDrawer(); show($('#drawerOverlay')); show($('#drawer')); }
function closeDrawer() { hide($('#drawer')); hide($('#drawerOverlay')); }
$('#cartBtn').addEventListener('click', openDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
$('#drawerOverlay').addEventListener('click', closeDrawer);
$('#emptyShopBtn').addEventListener('click', () => {
  closeDrawer();
  $('#collection').scrollIntoView({ behavior: 'smooth' });
});

function renderDrawer() {
  const drawer = $('#drawer');
  drawer.classList.toggle('is-empty', cart.length === 0);
  $('#drawerCount').textContent = cart.length ? `· ${cartCount()} item${cartCount() > 1 ? 's' : ''}` : '';
  const box = $('#drawerItems');
  box.innerHTML = '';
  cart.forEach(it => {
    const p = findProduct(it.id);
    const row = document.createElement('div');
    row.className = 'citem';
    row.innerHTML = `
      <div class="citem-thumb">${fabricSVG(p, 'cart-' + it.size)}</div>
      <div class="citem-mid">
        <h4>${p.name}</h4>
        <p class="meta">Size ${it.size} · ${NPR(p.price)}</p>
        <div class="qty">
          <button data-d="-1" aria-label="Decrease">−</button>
          <b>${it.qty}</b>
          <button data-d="1" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="citem-right">
        <b>${NPR(p.price * it.qty)}</b>
        <button class="citem-rm">Remove</button>
      </div>`;
    $$('[data-d]', row).forEach(btn => btn.addEventListener('click', () =>
      setQty(it.id, it.size, it.qty + Number(btn.dataset.d))));
    $('.citem-rm', row).addEventListener('click', () => removeItem(it.id, it.size));
    box.appendChild(row);
  });
  const sub = cartSubtotal(), ship = shipping();
  $('#subTotal').textContent = NPR(sub);
  $('#shipTotal').textContent = ship === 0 ? 'Free' : NPR(ship);
  $('#grandTotal').textContent = NPR(sub + ship);
  $('#freeShip').textContent = (sub > 0 && sub < FREE_SHIP_AT)
    ? `Add ${NPR(FREE_SHIP_AT - sub)} more for free shipping across Nepal`
    : (sub >= FREE_SHIP_AT ? '✦ Free shipping unlocked' : '');
}

/* ─────────────────────── checkout flow ──────────────────────── */
const stepEls = { 1: $('#step1'), 2: $('#step2'), 3: $('#step3'), p: $('#stepProcessing'), s: $('#stepSuccess') };

function gotoStep(key) {
  Object.values(stepEls).forEach(el => { el.hidden = true; });
  stepEls[key].hidden = false;
  $$('.step').forEach(s => {
    const n = Number(s.dataset.step);
    s.classList.toggle('active', String(n) === String(key));
    s.classList.toggle('done', typeof key === 'number' && n < key);
  });
  $('#steps').style.display = (key === 'p' || key === 's') ? 'none' : 'flex';
}

function openCheckout() {
  if (cart.length === 0) return;
  closeDrawer();
  gotoStep(1);
  show($('#checkoutOverlay')); show($('#checkout'));
}
function closeCheckout() { hide($('#checkout')); hide($('#checkoutOverlay')); }
$('#checkoutBtn').addEventListener('click', openCheckout);
$('#checkoutClose').addEventListener('click', closeCheckout);
$('#checkoutOverlay').addEventListener('click', closeCheckout);

function validate(ids) {
  let ok = true;
  ids.forEach(id => {
    const el = $(id);
    el.classList.remove('err');
    if (!el.value.trim()) { el.classList.add('err'); ok = false; }
  });
  return ok;
}

$('#toStep2').addEventListener('click', () => {
  if (validate(['#fName', '#fPhone', '#fAddr', '#fCity'])) gotoStep(2);
});
$('#backTo1').addEventListener('click', () => gotoStep(1));
$('#toStep3').addEventListener('click', () => {
  const pay = $('input[name="pay"]:checked').value;
  if (pay === 'Card' && !validate(['#fCard', '#fExp', '#fCvc'])) return;
  buildReview(); gotoStep(3);
});
$('#backTo2').addEventListener('click', () => gotoStep(2));

/* show card fields only for card payment */
$('#paylist').addEventListener('change', () => {
  const isCard = $('input[name="pay"]:checked').value === 'Card';
  $('#cardFields').style.display = isCard ? 'grid' : 'none';
});

/* light input formatting for the fake card */
$('#fCard').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
});
$('#fExp').addEventListener('input', e => {
  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;
});

function buildReview() {
  const sub = cartSubtotal(), ship = shipping();
  const pay = $('input[name="pay"]:checked').value;
  const items = cart.map(it => {
    const p = findProduct(it.id);
    return `<div class="rv-row"><span>${p.name} · ${it.size} × ${it.qty}</span><b>${NPR(p.price * it.qty)}</b></div>`;
  }).join('');
  $('#reviewBox').innerHTML = `
    <p class="rv-head">Items</p>${items}
    <p class="rv-head">Deliver to</p>
    <div class="rv-row"><span>${$('#fName').value}</span><b>${$('#fPhone').value}</b></div>
    <div class="rv-row"><span>${$('#fAddr').value}, ${$('#fCity').value}</span><b>${$('#fProv').value}</b></div>
    <p class="rv-head">Payment</p>
    <div class="rv-row"><span>${pay}</span><b>${pay === 'Card' ? '•••• ' + $('#fCard').value.slice(-4) : 'Simulated'}</b></div>
    <div class="rv-row"><span>Shipping</span><b>${ship === 0 ? 'Free' : NPR(ship)}</b></div>
    <div class="rv-row total"><span>Total</span><b>${NPR(sub + ship)}</b></div>`;
}

$('#placeOrder').addEventListener('click', () => {
  gotoStep('p');
  const total = cartSubtotal() + shipping();
  const count = cartCount();
  setTimeout(() => {
    $('#orderNo').textContent = 'VS-' + String(Math.floor(100000 + Math.random() * 900000));
    $('#successSummary').textContent =
      `${count} item${count > 1 ? 's' : ''} · ${NPR(total)} · arriving on a bicycle in a simulated 3–5 days.`;
    cart = []; saveCart(); renderCartBadge(); renderDrawer();
    gotoStep('s');
    dropPetals();
  }, 1900);
});

$('#successClose').addEventListener('click', closeCheckout);

function dropPetals() {
  const box = $('#petals');
  box.innerHTML = '';
  const hues = ['#e9a83c', '#f3c877', '#d93a32', '#c22b48'];
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = hues[i % hues.length];
    el.style.animationDuration = 2.4 + Math.random() * 2.4 + 's';
    el.style.animationDelay = Math.random() * 1.4 + 's';
    box.appendChild(el);
  }
}

/* ───────────────── nav / rail / reveals / esc ────────────────── */
window.addEventListener('scroll', () => {
  $('#nav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () =>
  document.getElementById(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));

$$('.rail-dot').forEach(dot => dot.addEventListener('click', () =>
  document.getElementById(dot.dataset.target)?.scrollIntoView({ behavior: 'smooth' })));

const railIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    $$('.rail-dot').forEach(d =>
      d.classList.toggle('active', d.dataset.target === en.target.id));
  });
}, { rootMargin: '-40% 0px -50% 0px' });
['hero', 'story', 'craft', 'collection'].forEach(id => railIO.observe(document.getElementById(id)));

const revealIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
  });
}, { threshold: 0.15 });
$$('.rv').forEach(el => revealIO.observe(el));

/* duplicate marquee content for a seamless loop */
const mq = $('#marqueeTrack');
mq.innerHTML += mq.innerHTML;

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#checkout').hidden) closeCheckout();
  else if (!$('#pmodal').hidden) closeProduct();
  else if (!$('#drawer').hidden) closeDrawer();
});

/* initial paint */
renderGrid();
renderCartBadge();
renderDrawer();
$('#cardFields').style.display = 'grid';

/* ═══════════════════════════════════════════════════════════════
   THE CINEMATIC SCENE
   A dhaka cloth breathing in Himalayan wind, prayer flags on a
   line, a rotating gold mandala, drifting ember-dust — all driven
   by scroll through camera keyframes.
   ═══════════════════════════════════════════════════════════════ */
(function initScene() {
  const canvas = document.getElementById('scene');
  if (!window.THREE) { canvas.remove(); return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  /* ── the great cloth ── */
  const clothUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 1 },
    uCol1: { value: new THREE.Color('#8e1f1f') },   // crimson deep
    uCol2: { value: new THREE.Color('#232055') },   // indigo
    uCol3: { value: new THREE.Color('#e9a83c') },   // gold
  };
  const clothMat = new THREE.ShaderMaterial({
    uniforms: clothUniforms,
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader: `
      uniform float uTime; uniform float uAmp;
      varying vec2 vUv; varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        float w = sin(p.x * 1.35 + uTime * 1.15) * 0.34
                + sin(p.x * 2.9 + p.y * 2.1 + uTime * 0.8) * 0.17
                + sin(p.y * 3.8 - uTime * 1.5) * 0.11;
        w *= uAmp;
        p.z += w;
        p.y += sin(p.x * 0.8 + uTime * 0.5) * 0.09 * uAmp;
        vWave = w;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      precision highp float;
      uniform vec3 uCol1; uniform vec3 uCol2; uniform vec3 uCol3;
      varying vec2 vUv; varying float vWave;
      void main() {
        vec2 uv = vUv;
        // base drape: indigo shadow into crimson body
        vec3 col = mix(uCol2, uCol1, smoothstep(0.05, 0.95, uv.y + vWave * 0.35));
        // dhaka diamond lattice in gold
        float dx = abs(fract(uv.x * 12.0) - 0.5);
        float dy = abs(fract(uv.y * 8.0) - 0.5);
        float d = dx + dy;
        float lattice = smoothstep(0.47, 0.45, d) - smoothstep(0.415, 0.395, d);
        col = mix(col, uCol3, lattice * 0.9);
        float dot_ = 1.0 - smoothstep(0.05, 0.09, d);
        col = mix(col, uCol3 * 1.15, dot_ * 0.85);
        // thread texture
        col *= 0.93 + 0.07 * sin(uv.x * 520.0);
        col *= 0.95 + 0.05 * sin(uv.y * 340.0);
        // light raking across the wave
        col *= 1.0 + vWave * 0.6;
        // soft edges
        float a = smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x)
                * smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
        gl_FragColor = vec4(col, a * 0.96);
      }`,
  });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 4.4, 130, 80), clothMat);
  scene.add(cloth);

  /* ── prayer flags on a sagging line ── */
  const FLAG_HUES = ['#3d66c9', '#e8e2d2', '#d93a32', '#3f9c5b', '#e9a83c', '#3d66c9', '#d93a32'];
  const flags = new THREE.Group();
  const flagLineY = x => 2.5 - Math.pow(x / 4.4, 2) * -0.55 - 0.35 * Math.cos(x * 0.5); // gentle sag
  FLAG_HUES.forEach((hex, i) => {
    const x = -4.4 + i * (8.8 / (FLAG_HUES.length - 1));
    const uniforms = {
      uTime: { value: 0 },
      uPhase: { value: i * 1.3 },
      uColor: { value: new THREE.Color(hex) },
      uOpacity: { value: 0.0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, side: THREE.DoubleSide, transparent: true, depthWrite: false,
      vertexShader: `
        uniform float uTime; uniform float uPhase;
        varying vec2 vUv; varying float vW;
        void main() {
          vUv = uv;
          vec3 p = position;
          float sway = sin(p.x * 4.0 + uTime * 2.2 + uPhase) * 0.09 * (1.0 - uv.y);
          p.z += sway;
          p.x += sin(uTime * 0.9 + uPhase) * 0.05;
          vW = sway;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        uniform vec3 uColor; uniform float uOpacity;
        varying vec2 vUv; varying float vW;
        void main() {
          vec3 col = uColor * (0.82 + vW * 2.2);
          col *= 0.92 + 0.08 * sin(vUv.y * 90.0);
          float a = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
          gl_FragColor = vec4(col, a * uOpacity);
        }`,
    });
    const f = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.56, 16, 12), mat);
    f.position.set(x, flagLineY(x) - 0.28, -2.6);
    f.rotation.z = Math.sin(i * 2.1) * 0.06;
    flags.add(f);
  });
  scene.add(flags);

  /* ── mandala of gold rings ── */
  const mandala = new THREE.Group();
  const ringMats = [];
  for (let i = 0; i < 5; i++) {
    const r = 1.1 + i * 0.62;
    const pts = [];
    const seg = 96;
    for (let j = 0; j <= seg; j++) {
      const t = (j / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0xe9a83c, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    ringMats.push(mat);
    const ring = new THREE.Line(geo, mat);
    ring.userData.speed = (i % 2 ? -1 : 1) * (0.08 + i * 0.03);
    mandala.add(ring);
  }
  /* radial ticks */
  {
    const pts = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * 3.2, Math.sin(t) * 3.2, 0));
      pts.push(new THREE.Vector3(Math.cos(t) * 3.55, Math.sin(t) * 3.55, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0xe9a83c, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    ringMats.push(mat);
    const ticks = new THREE.LineSegments(geo, mat);
    ticks.userData.speed = -0.05;
    mandala.add(ticks);
  }
  mandala.position.set(0, 0.1, -4.5);
  scene.add(mandala);

  /* ── drifting ember dust ── */
  const N = 340;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
    seed[i] = Math.random() * 100;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const dustUniforms = { uTime: { value: 0 } };
  const dustMat = new THREE.ShaderMaterial({
    uniforms: dustUniforms, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime; attribute float aSeed;
      varying float vTw;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + uTime * 0.16 + aSeed, 11.0) - 5.5;
        p.x += sin(uTime * 0.3 + aSeed) * 0.4;
        vTw = 0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 7.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.6 + fract(aSeed) * 2.6) * (120.0 / -mv.z) * 0.05;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      precision highp float;
      varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d) * 0.55 * vTw;
        gl_FragColor = vec4(0.95, 0.78, 0.45, a);
      }`,
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* ── camera keyframes over scroll ──
     p: overall document scroll 0→1
     cam / look: camera position & target
     amp: cloth wind strength · mand: mandala opacity
     flag: prayer-flag opacity · dim: scene fade under the shop  */
  const KEYS = [
    { p: 0.00, cam: [0.0, 0.0, 6.4], look: [0, 0, 0],     amp: 1.0,  mand: 0.0,  flag: 0.25, dim: 0.00 },
    { p: 0.20, cam: [2.7, 0.6, 4.4], look: [-0.5, 0, 0],  amp: 1.3,  mand: 0.85, flag: 0.45, dim: 0.00 },
    { p: 0.42, cam: [-2.0, 1.5, 6.6], look: [0, 0.4, -1], amp: 0.9,  mand: 0.35, flag: 1.0,  dim: 0.10 },
    { p: 0.66, cam: [0.0, 0.7, 9.4], look: [0, 0.2, 0],   amp: 0.65, mand: 0.0,  flag: 0.7,  dim: 0.55 },
    { p: 1.00, cam: [0.0, 0.4, 11.5], look: [0, 0, 0],    amp: 0.45, mand: 0.0,  flag: 0.35, dim: 0.78 },
  ];
  const smooth = t => t * t * (3 - 2 * t);
  function sampleKeys(p) {
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1].p < p) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = smooth(clamp((p - a.p) / (b.p - a.p), 0, 1));
    const mix3 = (u, v) => [lerp(u[0], v[0], t), lerp(u[1], v[1], t), lerp(u[2], v[2], t)];
    return {
      cam: mix3(a.cam, b.cam), look: mix3(a.look, b.look),
      amp: lerp(a.amp, b.amp, t), mand: lerp(a.mand, b.mand, t),
      flag: lerp(a.flag, b.flag, t), dim: lerp(a.dim, b.dim, t),
    };
  }

  /* ── input state ── */
  let scrollTarget = 0, scrollSmooth = 0;
  let mouseX = 0, mouseY = 0, mx = 0, my = 0;
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollTarget = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  };
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  readScroll();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── render loop ── */
  const clock = new THREE.Clock();
  const lookV = new THREE.Vector3();
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); loop(); }
  });

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    scrollSmooth = lerp(scrollSmooth, scrollTarget, 0.065);
    mx = lerp(mx, mouseX, 0.05);
    my = lerp(my, mouseY, 0.05);

    const k = sampleKeys(scrollSmooth);

    camera.position.set(
      k.cam[0] + mx * 0.35,
      k.cam[1] - my * 0.25,
      k.cam[2]
    );
    lookV.set(k.look[0], k.look[1], k.look[2]);
    camera.lookAt(lookV);

    clothUniforms.uTime.value = reduceMotion ? 0 : t;
    clothUniforms.uAmp.value = reduceMotion ? 0.15 : k.amp;
    cloth.rotation.y = scrollSmooth * 0.55 - 0.1;
    cloth.rotation.x = Math.sin(scrollSmooth * Math.PI) * -0.12;

    flags.children.forEach(f => {
      f.material.uniforms.uTime.value = reduceMotion ? 0 : t;
      f.material.uniforms.uOpacity.value = k.flag;
    });

    mandala.children.forEach(obj => {
      if (!reduceMotion) obj.rotation.z += obj.userData.speed * 0.016;
    });
    ringMats.forEach((m, i) => { m.opacity = k.mand * (0.5 - i * 0.05); });
    mandala.rotation.x = Math.sin(t * 0.2) * 0.08;

    dustUniforms.uTime.value = reduceMotion ? 0 : t;

    canvas.style.opacity = String(1 - k.dim);
    renderer.render(scene, camera);
  }
  loop();
})();
