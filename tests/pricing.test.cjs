const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateCart, formatGel, DELIVERY_FEES, PRODUCT_PRICES } = require('../pricing.js');

test('empty carts always have zero delivery fee', () => {
  for (const zone of Object.keys(DELIVERY_FEES)) {
    assert.deepEqual(calculateCart([], zone), { count: 0, subtotal: 0, fee: 0, total: 0 });
  }
});

test('calculates pickup totals in integer tetri', () => {
  assert.deepEqual(calculateCart([{ id: 'sunflower', qty: 2 }, { id: 'teddy', qty: 1 }], 'pickup'), {
    count: 3, subtotal: 10000, fee: 0, total: 10000
  });
});

test('adds the Kutaisi delivery fee once per non-empty cart', () => {
  assert.deepEqual(calculateCart([{ id: 'sunflower', qty: 2 }], 'kutaisi'), {
    count: 2, subtotal: 3000, fee: 199, total: 3199
  });
});

test('adds the nearby-area delivery fee', () => {
  assert.deepEqual(calculateCart([{ id: 'pink', qty: 1 }], 'nearby'), {
    count: 1, subtotal: 2500, fee: 999, total: 3499
  });
});

test('refuses unknown delivery options', () => {
  assert.throws(() => calculateCart([], 'international'), /Unknown delivery zone/);
});

test('refuses non-array carts and unknown products', () => {
  assert.throws(() => calculateCart(null, 'pickup'), /Invalid cart/);
  assert.throws(() => calculateCart([{ id: 'not-a-product', qty: 1 }], 'pickup'), /Invalid cart item/);
});

test('refuses invalid quantities and malformed entries', () => {
  for (const qty of [0, -1, 21, 1.5, '2', null]) {
    assert.throws(() => calculateCart([{ id: 'pink', qty }], 'pickup'), /Invalid cart item/);
  }
  assert.throws(() => calculateCart([null], 'pickup'), /Invalid cart item/);
});

test('formats GEL amounts consistently', () => {
  assert.equal(formatGel(0), '0 ₾');
  assert.equal(formatGel(199), '1.99 ₾');
  assert.equal(formatGel(1500), '15 ₾');
  assert.equal(formatGel(1099), '10.99 ₾');
});

test('rejects invalid money values', () => {
  for (const value of [-1, 1.2, NaN, Infinity, '100']) {
    assert.throws(() => formatGel(value), /Invalid price/);
  }
});

test('product prices are positive integer tetri', () => {
  for (const amount of Object.values(PRODUCT_PRICES)) {
    assert.ok(Number.isSafeInteger(amount) && amount > 0);
  }
});
