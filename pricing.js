/* Mira Flowers — pure pricing helpers, shared by browser and Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MiraPricing = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DELIVERY_FEES = Object.freeze({ pickup: 0, kutaisi: 199, nearby: 999 });
  const PRODUCT_PRICES = Object.freeze({ sunflower: 1500, mix: 2000, pink: 2500, teddy: 7000, lilac: 2500, pinkmini: 3000 });
  function calculateCart(items, delivery) {
    if (!Object.prototype.hasOwnProperty.call(DELIVERY_FEES, delivery)) throw new Error('Unknown delivery zone');
    if (!Array.isArray(items)) throw new Error('Invalid cart');
    let count = 0;
    let subtotal = 0;
    for (const item of items) {
      if (!item || !Object.prototype.hasOwnProperty.call(PRODUCT_PRICES, item.id) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) throw new Error('Invalid cart item');
      count += item.qty;
      subtotal += PRODUCT_PRICES[item.id] * item.qty;
    }
    const fee = count === 0 ? 0 : DELIVERY_FEES[delivery];
    return { count, subtotal, fee, total: subtotal + fee };
  }
  function formatGel(cents) {
    if (!Number.isSafeInteger(cents) || cents < 0) throw new Error('Invalid price');
    return (cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2)) + ' ₾';
  }
  return { DELIVERY_FEES, PRODUCT_PRICES, calculateCart, formatGel };
});
