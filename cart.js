const Cart = {
  /* ── read / write ───────────────────────────────────────── */
  get() {
    try {
      return JSON.parse(sessionStorage.getItem('matux_cart') || '[]');
    } catch {
      return [];
    }
  },

  save(items) {
    sessionStorage.setItem('matux_cart', JSON.stringify(items));
    Cart._notify();
  },

  /* ── add an item ────────────────────────────────────────── */
  add(id, name, price) {
    const items = Cart.get();
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price, qty: 1 });
    }
    Cart.save(items);
    Cart._showToast(name);
    Cart._updateBadge();
  },

  /* ── remove one item completely ─────────────────────────── */
  remove(id) {
    const items = Cart.get().filter(i => i.id !== id);
    Cart.save(items);
    Cart._updateBadge();
  },

  /* ── change quantity ────────────────────────────────────── */
  setQty(id, qty) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty < 1) {
      Cart.remove(id);
      return;
    }
    item.qty = qty;
    Cart.save(items);
    Cart._updateBadge();
  },

  /* ── clear everything ───────────────────────────────────── */
  clear() {
    sessionStorage.removeItem('matux_cart');
    Cart._notify();
    Cart._updateBadge();
  },

  /* ── totals ─────────────────────────────────────────────── */
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },

  /* ── build order summary string for the contact form ─────── */
  orderSummary() {
    const items = Cart.get();
    if (!items.length) return '';
    const lines = items.map(i => `${i.qty}x ${i.name} @ P${i.price} each`);
    lines.push('');
    lines.push(`TOTAL: P${Cart.total()}`);
    return lines.join('\n');
  },

  /* ── update cart badge number in nav ────────────────────── */
  _updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = Cart.count();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  /* ── fire a custom event so any open panel can refresh ──── */
  _notify() {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  /* ── small toast popup ──────────────────────────────────── */
  _showToast(name) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = `
        position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
        background:#004d40; color:#fff; padding:12px 24px;
        border-radius:30px; font-size:14px; font-weight:600;
        box-shadow:0 8px 30px rgba(0,0,0,0.2); z-index:9999;
        opacity:0; transition:opacity 0.3s; white-space:nowrap;
        font-family:'DM Sans',sans-serif;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = `✓  ${name} added to cart`;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  }
};

/* ── auto-init badge on every page load ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Cart._updateBadge();
});
