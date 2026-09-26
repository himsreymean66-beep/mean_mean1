/* =========================================================
   main.js — តក្កវិជ្ជាទាំងអស់របស់គេហទំព័រ Crispy Crown
   ========================================================= */

/* ---------- 0. ថេរ (Constants) ---------- */
const CART_KEY   = "cc_cart";       // ឈ្មោះ key ក្នុង localStorage សម្រាប់កន្ត្រក
const ORDER_KEY  = "cc_last_order"; // រក្សាទុកការកម្មង់ចុងក្រោយ
const NOTIF_KEY  = "cc_notifications"; // ឈ្មោះ key សម្រាប់ការជូនដំណឹង
const DELIVERY   = 1.50;            // ថ្លៃដឹកជញ្ជូន
const FREE_OVER  = 20;              // ទិញលើស $20 ដឹកជញ្ជូនឥតគិតថ្លៃ
const VAT_RATE   = 0.10;            // អាករ ១០%

/* ---------- 1. ឧបករណ៍ជំនួយ (Helpers) ---------- */
const $  = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const money = (n) => "$" + Number(n).toFixed(2);

/* បង្ហាញសារតូចៗខាងក្រោមអេក្រង់ */
function toast(message) {
  let box = $(".toast");
  if (!box) {
    box = document.createElement("div");
    box.className = "toast";
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.classList.add("show");
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.remove("show"), 2200);
}

/* ---------- 2. LOCALSTORAGE + កន្ត្រក ---------- */

/* អានកន្ត្រកពី localStorage → ប្រែពី JSON ទៅ Array */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];               // បើទិន្នន័យខូច យើងចាប់ផ្តើមជាមួយកន្ត្រកទទេ
  }
}

/* សរសេរកន្ត្រកទៅ localStorage → ប្រែពី Array ទៅ JSON */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/* បន្ថែមផលិតផលទៅក្នុងកន្ត្រក */
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const line = cart.find((item) => item.id === productId);

  if (line) {
    line.qty += qty;                       // មានរួចហើយ → បូកបរិមាណ
  } else {
    cart.push({                            // មិនទាន់មាន → បន្ថែមថ្មី
      id: product.id,
      name: product.name,
      kh: product.kh,
      price: product.price,
      img: product.img,
      qty: qty
    });
  }
  saveCart(cart);
  toast(product.kh + " ត្រូវបានបញ្ចូលក្នុងកន្ត្រក");
}

/* ប្តូរបរិមាណ (+1 ឬ -1) */
function changeQty(productId, delta) {
  const cart = getCart();
  const line = cart.find((item) => item.id === productId);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) return removeFromCart(productId);
  saveCart(cart);
}

/* ដកផលិតផលចេញ */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

/* សម្អាតកន្ត្រកទាំងស្រុង */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

/* រាប់ចំនួនទំនិញសរុប */
function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* គណនាតម្លៃដោយស្វ័យប្រវត្តិ */
function calcTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_OVER ? 0 : DELIVERY;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + delivery + vat;
  return { subtotal, delivery, vat, total };
}

/* បង្ហាញលេខនៅលើប៊ូតុងកន្ត្រក */
function updateCartBadge() {
  $$(".cart-count").forEach((el) => {
    const n = cartCount();
    if (el.textContent !== String(n)) {
      el.textContent = n;
      el.classList.remove("pop");
      void el.offsetWidth;          // បង្ខំ browser ឲ្យចាប់ផ្តើម animation ឡើងវិញ
      el.classList.add("pop");
    }
  });
}

/* ---------- 3. បង្ហាញកាតផលិតផល ---------- */
function productCardHTML(p) {
  const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
  const old = p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : "";
  return `
    <article class="card" data-category="${p.category}">
      <div class="card__media">
        ${badge}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card__body">
        <h3>${p.kh}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__foot">
          <span class="price">${old}${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">បន្ថែម</button>
        </div>
      </div>
    </article>`;
}

function renderProducts(list, mountSelector) {
  const mount = $(mountSelector);
  if (!mount) return;
  if (list.length === 0) {
    mount.innerHTML = `<p class="empty">រកមិនឃើញម្ហូបដែលត្រូវនឹងការស្វែងរកទេ។ សាកល្បងពាក្យផ្សេង។</p>`;
    return;
  }
  mount.innerHTML = list.map(productCardHTML).join("");
}

/* ចាប់ការចុចប៊ូតុង "បន្ថែម" ទាំងអស់ (Event Delegation) */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});

/* ---------- 3.5 ការជូនដំណឹង (NOTIFICATIONS) ---------- */

/* បង្ហាញ "ប៉ុន្មាននាទីមុន / ម៉ោងមុន / ថ្ងៃមុន" ជាភាសាខ្មែរ */
function timeAgo(timestamp) {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "ទើបតែឥឡូវ";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + " នាទីមុន";
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + " ម៉ោងមុន";
  const diffDay = Math.floor(diffHr / 24);
  return diffDay + " ថ្ងៃមុន";
}

/* អានបញ្ជីការជូនដំណឹងពី localStorage */
function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/* រក្សាទុកបញ្ជីការជូនដំណឹង + ធ្វើបច្ចុប្បន្នភាពលេខសញ្ញា */
function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  updateNotifBadge();
}

/* បន្ថែមការជូនដំណឹងថ្មីមួយនៅកំពូលបញ្ជី */
function addNotification({ title, body }) {
  const list = getNotifications();
  list.unshift({
    id: "n" + Date.now(),
    title,
    body,
    time: Date.now(),
    read: false
  });
  saveNotifications(list.slice(0, 20)); // រក្សាទុកតែ ២០ ចុងក្រោយ ដើម្បីកុំឲ្យលើសទំហំ
  renderNotifications();
}

/* រាប់ចំនួនការជូនដំណឹងមិនទាន់អាន */
function unreadCount() {
  return getNotifications().filter((n) => !n.read).length;
}

/* ធ្វើបច្ចុប្បន្នភាពលេខសញ្ញាក្រហមលើកណ្តឹងគ្រប់ទំព័រ */
function updateNotifBadge() {
  const n = unreadCount();
  $$(".notif-count").forEach((el) => {
    el.hidden = n === 0;
    if (el.textContent !== String(n)) {
      el.textContent = n;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    }
  });
}

/* បង្ហាញការជូនដំណឹងក្នុងប្រអប់ dropdown */
function renderNotifications() {
  const list = getNotifications();
  const mount = $("#notif-list");
  if (!mount) return;

  if (list.length === 0) {
    mount.innerHTML = `<p class="notif-empty">មិនទាន់មានការជូនដំណឹងទេ។</p>`;
    return;
  }

  mount.innerHTML = list.map((n) => `
    <div class="notif-item ${n.read ? "" : "is-unread"}" data-notif="${n.id}">
      <span class="dot"></span>
      <div class="notif-body">
        <b>${n.title}</b>
        <p>${n.body}</p>
        <time>${timeAgo(n.time)}</time>
      </div>
    </div>`).join("");
}

/* ចាប់ផ្តើមប្រព័ន្ធការជូនដំណឹង (ហៅរាល់ទំព័រតាមរយៈ initHeader) */
function initNotifications() {
  const toggle = $("#notif-toggle");
  const panel  = $("#notif-panel");
  const clearBtn = $("#notif-clear");
  if (!toggle || !panel) return;

  // ដាក់ Seed លើកដំបូងតែប៉ុណ្ណោះ បើមិនទាន់មានទិន្នន័យអ្វីទាល់តែសោះ
  if (localStorage.getItem(NOTIF_KEY) === null) {
    const seeded = NOTIF_SEED.map((n, i) => ({
      id: "seed" + i,
      title: n.title,
      body: n.body,
      time: Date.now() - (i + 1) * 3600 * 1000, // ធ្វើឲ្យមើលទៅដូចជាមុន
      read: false
    }));
    localStorage.setItem(NOTIF_KEY, JSON.stringify(seeded));
  }

  renderNotifications();
  updateNotifBadge();

  // បើក/បិទប្រអប់
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    panel.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", willOpen);

    // ពេលបើកមើល → សម្គាល់ថាបានអានទាំងអស់
    if (willOpen) {
      const list = getNotifications().map((n) => ({ ...n, read: true }));
      saveNotifications(list);
      renderNotifications();
    }
  });

  // ចុចខាងក្រៅ → បិទប្រអប់
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !e.target.closest(".notif")) {
      panel.hidden = true;
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // សម្អាតទាំងអស់
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveNotifications([]);
      renderNotifications();
    });
  }
}

/* ---------- 4. HEADER: ម៉ឺនុយទូរស័ព្ទ + តំណសកម្ម ---------- */
function initHeader() {
  const burger = $(".burger");
  const nav = $(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      burger.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", nav.classList.contains("is-open"));
    });
  }
  const page = document.body.dataset.page;
  $$(".nav__link").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  updateCartBadge();
  initNotifications();
}

/* ---------- 5. ទំព័រដើម (Home) ---------- */
function initHome() {
  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));
  renderProducts(featured, "#featured-products");
}

/* ---------- 6. ទំព័រម៉ឺនុយ: ស្វែងរក + ត្រងតាមប្រភេទ ---------- */
function initMenu() {
  let activeCategory = "all";
  let keyword = "";

  // បង្កើតប៊ូតុងប្រភេទ
  const filterBox = $("#filters");
  filterBox.innerHTML = CATEGORIES.map(
    (c) => `<button class="chip ${c.id === "all" ? "is-active" : ""}" data-cat="${c.id}">${c.label}</button>`
  ).join("");

  function applyFilters() {
    const list = PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const text = (p.name + " " + p.kh + " " + p.desc).toLowerCase();
      const matchText = text.includes(keyword.toLowerCase().trim());
      return matchCat && matchText;
    });
    renderProducts(list, "#menu-products");
    $("#result-count").textContent = list.length + " មុខម្ហូប";
  }

  filterBox.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip", filterBox).forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeCategory = chip.dataset.cat;
    applyFilters();
  });

  $("#search-input").addEventListener("input", (e) => {
    keyword = e.target.value;
    applyFilters();
  });

  // បើមកពីទំព័រផ្សេងដោយមាន ?cat=drinks
  const urlCat = new URLSearchParams(location.search).get("cat");
  if (urlCat) {
    const chip = $(`[data-cat="${urlCat}"]`, filterBox);
    if (chip) chip.click();
  }
  applyFilters();
}

/* ---------- 7. ទំព័រការផ្តល់ជូន (Deals) ---------- */
function initDeals() {
  const mount = $("#deals-list");
  mount.innerHTML = DEALS.map((d) => {
    const p = PRODUCTS.find((x) => x.id === d.productId);
    return `
      <article class="deal">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <span class="deal__tag">${d.tag}</span>
          <h3>${d.title}</h3>
          <p class="card__desc">${d.text}</p>
          <p class="price">${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}${money(p.price)}</p>
        </div>
        <button class="btn btn--primary" data-add="${p.id}">បន្ថែមទៅកន្ត្រក</button>
      </article>`;
  }).join("");
}

/* ---------- 8. ទំព័រកន្ត្រក (Cart) ---------- */
function initCart() {
  renderCart();

  // ចុច + / − / លុប
  $("#cart-list").addEventListener("click", (e) => {
    const plus = e.target.closest("[data-plus]");
    const minus = e.target.closest("[data-minus]");
    const del = e.target.closest("[data-remove]");
    if (plus)  { changeQty(plus.dataset.plus, 1);   renderCart(); }
    if (minus) { changeQty(minus.dataset.minus, -1); renderCart(); }
    if (del)   { removeFromCart(del.dataset.remove); renderCart(); toast("បានលុបចេញពីកន្ត្រក"); }
  });

  $("#clear-cart").addEventListener("click", () => {
    if (confirm("តើអ្នកពិតជាចង់សម្អាតកន្ត្រកមែនទេ?")) {
      clearCart();
      renderCart();
    }
  });
}

function renderCart() {
  const cart = getCart();
  const list = $("#cart-list");

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h3>កន្ត្រករបស់អ្នកនៅទទេ</h3>
        <p>ចូលទៅកាន់ម៉ឺនុយ ដើម្បីជ្រើសរើសម្ហូបដែលអ្នកចូលចិត្ត។</p>
        <p><a class="btn btn--primary" href="menu.html">មើលម៉ឺនុយ</a></p>
      </div>`;
  } else {
    list.innerHTML = cart.map((i) => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div>
          <h3>${i.kh}</h3>
          <small>${money(i.price)} × ${i.qty} = <b>${money(i.price * i.qty)}</b></small><br>
          <button class="remove" data-remove="${i.id}">លុបចេញ</button>
        </div>
        <div class="qty">
          <button data-minus="${i.id}" aria-label="បន្ថយ">−</button>
          <span>${i.qty}</span>
          <button data-plus="${i.id}" aria-label="បន្ថែម">+</button>
        </div>
      </div>`).join("");
  }
  renderSummary();
}

/* បង្ហាញតារាងសរុប (ប្រើទាំងទំព័រ cart និង checkout) */
function renderSummary() {
  const t = calcTotals();
  const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  set("#sum-subtotal", money(t.subtotal));
  set("#sum-delivery", t.delivery === 0 ? "ឥតគិតថ្លៃ" : money(t.delivery));
  set("#sum-vat", money(t.vat));
  set("#sum-total", money(t.total));
  set("#sum-count", cartCount() + " មុខ");

  const checkoutBtn = $("#to-checkout");
  if (checkoutBtn) checkoutBtn.toggleAttribute("disabled", cartCount() === 0);
}

/* ---------- 9. ទំព័របង់ប្រាក់ (Checkout) + ការត្រួតពិនិត្យទម្រង់ ---------- */
function initCheckout() {
  // បើកន្ត្រកទទេ មិនអនុញ្ញាតឲ្យបង់ប្រាក់ទេ
  if (cartCount() === 0) {
    $("#checkout-main").innerHTML = `
      <div class="empty">
        <h3>មិនមានទំនិញសម្រាប់បង់ប្រាក់ទេ</h3>
        <p><a class="btn btn--primary" href="menu.html">ត្រឡប់ទៅម៉ឺនុយ</a></p>
      </div>`;
    return;
  }

  // បង្ហាញបញ្ជីទំនិញខ្លីៗ
  $("#checkout-items").innerHTML = getCart()
    .map((i) => `<div class="summary__row"><span>${i.kh} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`)
    .join("");
  renderSummary();

  const form = $("#checkout-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();               // ឃាត់ការ reload ទំព័រ
    if (validateCheckout(form)) placeOrder(form);
  });

  // ពិនិត្យម្តងទៀតពេលអ្នកប្រើវាយ
  $$("input, select, textarea", form).forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
  });
}

/* ត្រួតពិនិត្យវាលមួយ */
function validateField(el) {
  const field = el.closest(".field");
  if (!field) return true;
  const errBox = $(".error", field);
  let msg = "";
  const v = el.value.trim();

  if (el.hasAttribute("required") && v === "") {
    msg = "សូមបំពេញវាលនេះ";
  } else if (el.id === "phone" && v && !/^0\d{8,9}$/.test(v)) {
    msg = "លេខទូរស័ព្ទត្រូវចាប់ផ្តើមដោយ 0 និងមាន ៩ ឬ ១០ ខ្ទង់";
  } else if (el.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) {
    msg = "អ៊ីមែលមិនត្រឹមត្រូវ";
  } else if (el.id === "name" && v && v.length < 3) {
    msg = "ឈ្មោះត្រូវមានយ៉ាងតិច ៣ តួអក្សរ";
  } else if (el.id === "address" && v && v.length < 10) {
    msg = "សូមបញ្ចូលអាសយដ្ឋានលម្អិតជាងនេះ";
  }

  if (errBox) errBox.textContent = msg;
  field.classList.toggle("has-error", msg !== "");
  return msg === "";
}

/* ត្រួតពិនិត្យទម្រង់ទាំងមូល */
function validateCheckout(form) {
  let ok = true;
  $$("input, select, textarea", form).forEach((el) => {
    if (!validateField(el)) ok = false;
  });
  if (!ok) {
    toast("សូមពិនិត្យព័ត៌មានឡើងវិញ");
    const first = $(".has-error input, .has-error select, .has-error textarea", form);
    if (first) first.focus();
  }
  return ok;
}

/* បញ្ជាក់ការកម្មង់ */
function placeOrder(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const totals = calcTotals();
  const order = {
    id: "CC-" + Date.now().toString().slice(-6),
    date: new Date().toLocaleString(),
    customer: data,
    items: getCart(),
    totals: totals
  };

  localStorage.setItem(ORDER_KEY, JSON.stringify(order)); // រក្សាទុកការកម្មង់
  clearCart();                                            // សម្អាតកន្ត្រក

  // ជូនដំណឹងថាការកម្មង់ជោគជ័យ
  addNotification({
    title: "ការកម្មង់ជោគជ័យ ✅",
    body: `លេខកម្មង់ ${order.id} សរុប ${money(totals.total)} កំពុងត្រូវបានរៀបចំ។`
  });

  $("#order-id").textContent = order.id;
  $("#order-total").textContent = money(totals.total);
  $("#order-name").textContent = data.name;
  $("#success-modal").classList.add("is-open");
  form.reset();
}

/* ---------- 10. ទំព័រទំនាក់ទំនង (Contact) ---------- */

/* ពិនិត្យថាហាងកំពុងបើក ឬបិទ ដោយផ្អែកលើម៉ោងឥឡូវនេះ (បើក ០៨:០០–២១:០០ រៀងរាល់ថ្ងៃ) */
function updateLiveStatus() {
  const chip = $("#live-status");
  const text = $("#live-status-text");
  if (!chip || !text) return;

  const hour = new Date().getHours();
  const isOpen = hour >= 8 && hour < 21;

  chip.classList.toggle("open", isOpen);
  chip.classList.toggle("closed", !isOpen);
  text.textContent = isOpen
    ? "កំពុងបើកឥឡូវនេះ · បិទម៉ោង ២១:០០"
    : "បិទហើយ · បើកម៉ោង ០៨:០០ ព្រឹកស្អែក";
}

/* ចុចប៊ូតុងសំណួរលឿន → បំពេញទម្រង់ដោយស្វ័យប្រវត្តិ */
function initQuickChips() {
  const wrap = $("#quick-chips");
  if (!wrap) return;
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const topicSel = $("#topic");
    const msgBox = $("#message");
    if (topicSel) topicSel.value = btn.dataset.topic;
    if (msgBox) msgBox.value = btn.dataset.msg;
    $("#name")?.focus();
    toast("បានបំពេញទម្រង់ជូន — សូមបន្ថែមឈ្មោះ និងទំនាក់ទំនង");
  });
}

function initContact() {
  updateLiveStatus();
  initQuickChips();
  const form = $("#contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input, textarea, select", form).forEach((el) => {
      if (!validateField(el)) ok = false;
    });
    if (ok) {
      $("#contact-success").hidden = false;
      addNotification({
        title: "សារត្រូវបានផ្ញើ 📩",
        body: "យើងទទួលបានសាររបស់អ្នកហើយ នឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។"
      });
      form.reset();
      toast("សាររបស់អ្នកត្រូវបានផ្ញើ");
    }
  });
}

/* ---------- 11. ROUTER: ដំណើរការមុខងារតាមទំព័រនីមួយៗ ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  const page = document.body.dataset.page;

  if (page === "home")     initHome();
  if (page === "menu")     initMenu();
  if (page === "deals")    initDeals();
  if (page === "cart")     initCart();
  if (page === "checkout") initCheckout();
  if (page === "contact")  initContact();
});

/* បើអ្នកប្រើបើកគេហទំព័រច្រើន tab ធ្វើឲ្យលេខកន្ត្រកដូចគ្នា */
window.addEventListener("storage", updateCartBadge);
