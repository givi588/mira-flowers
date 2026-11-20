'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const pricing = require('../pricing.js');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

function loadStorefront(writeText) {
  const elements = new Map();
  const document = {
    activeElement: null,
    addEventListener() {},
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, { textContent: '', setAttribute() {} });
      return elements.get(selector);
    },
  };
  const context = vm.createContext({
    document,
    MiraPricing: pricing,
    localStorage: { getItem: () => '[{"id":"sunflower","qty":1}]' },
    navigator: { clipboard: { writeText } },
    window: { isSecureContext: true },
  });
  vm.runInContext(script, context);
  vm.runInContext("defaultCartStatus = 'Copy the current order';", context);
  return {
    copy: () => vm.runInContext('copyOrder()', context),
    increaseQuantity: () => vm.runInContext(
      "updateQty({ dataset: { qty: 'sunflower', delta: '1' } })", context
    ),
    status: () => document.querySelector('#cart-status').textContent,
  };
}

test('copy feedback resets when the order changes', async () => {
  const storefront = loadStorefront(() => Promise.resolve());
  await storefront.copy();
  assert.match(storefront.status(), /დაკოპირებულია/);
  storefront.increaseQuantity();
  assert.equal(storefront.status(), 'Copy the current order');
});

test('a delayed clipboard result cannot publish success for an earlier order', async () => {
  let finishCopy;
  const storefront = loadStorefront(() => new Promise(resolve => { finishCopy = resolve; }));
  const pending = storefront.copy();
  storefront.increaseQuantity();
  finishCopy();
  await pending;
  assert.equal(storefront.status(), 'Copy the current order');
});
