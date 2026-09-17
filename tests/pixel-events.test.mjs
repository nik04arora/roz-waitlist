import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import waitlistHandler from '../api/waitlist.js';

const root = new URL('../', import.meta.url);
const homepage = await readFile(new URL('index.html', root), 'utf8');
const marker = "var modal = document.querySelector('.email_modal');";
const markerAt = homepage.indexOf(marker);
assert.ok(markerAt > 0, 'waitlist script exists');
const formScript = homepage.slice(homepage.lastIndexOf('<script>', markerAt) + 8, homepage.indexOf('</script>', markerAt));

function element(tagName = 'DIV') {
  const listeners = {};
  const classes = new Set();
  return {
    tagName,
    listeners,
    style: {},
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); }
    },
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener(name, listener) { listeners[name] = listener; },
    focus() {},
    querySelectorAll() { return []; }
  };
}

function setupForm(result, hash = '') {
  const modal = element();
  const form = element('FORM');
  const phoneInput = element('INPUT');
  const submitButton = element('INPUT');
  const status = element();
  const triggers = [element('A'), element('A'), element('BUTTON')];
  const selectors = {
    '.email_modal': modal,
    '.email_modal-scrim': element(),
    '.email_modal-close': element('BUTTON'),
    '#wf-form-Android-Sign-Up': form,
    '#Phone-Number': phoneInput,
    '.btn.cc-newsletter': submitButton,
    '.mobile-sticky-cta': element(),
    '.waitlist-status': status
  };
  const calls = [];
  let fetches = 0;
  const document = {
    activeElement: element(),
    body: { style: {} },
    querySelector(selector) { return selectors[selector] || null; },
    querySelectorAll() { return triggers; },
    addEventListener() {}
  };
  const window = {
    fbq(...args) { calls.push(args); },
    setTimeout(fn) { fn(); },
    location: { hash }
  };
  vm.runInNewContext(formScript, {
    document,
    window,
    fetch: async () => {
      fetches++;
      return { ok: result.ok, json: async () => result };
    }
  });
  return { calls, triggers, form, phoneInput, status, get fetches() { return fetches; } };
}

function click(trigger) {
  trigger.listeners.click({ preventDefault() {} });
}

async function submit(form) {
  await form.listeners.submit({ preventDefault() {}, stopImmediatePropagation() {} });
}

test('every waitlist CTA records JoinWaitlist when opening the popup', () => {
  const page = setupForm({ ok: true, created: true });
  for (const trigger of page.triggers) click(trigger);
  assert.equal(page.calls.length, 3);
  assert.ok(page.calls.every(([method, name]) => method === 'trackCustom' && name === 'JoinWaitlist'));
});

test('a Learn-page waitlist link opens the popup and records its event', () => {
  const page = setupForm({ ok: true, created: true }, '#waitlist');
  assert.deepEqual(page.calls, [['trackCustom', 'JoinWaitlist']]);
});

test('Lead fires only after a new successful signup, without phone data', async () => {
  const page = setupForm({ ok: true, created: true, phone: '+919876543210' });
  page.phoneInput.value = '9876543210';
  await submit(page.form);
  assert.equal(page.fetches, 1);
  assert.deepEqual(page.calls, [['track', 'Lead']]);
  assert.ok(!JSON.stringify(page.calls).includes('9876543210'));
});

test('invalid, duplicate, and failed submissions do not record Lead', async () => {
  for (const [phone, result] of [
    ['123', { ok: true, created: true }],
    ['9876543210', { ok: true, created: false }],
    ['9876543210', { ok: false, error: 'Unavailable' }]
  ]) {
    const page = setupForm(result);
    page.phoneInput.value = phone;
    await submit(page.form);
    assert.equal(page.calls.length, 0);
  }
});

async function apiRequest(duplicate) {
  const response = {
    setHeader() {},
    end(text) { this.body = JSON.parse(text); }
  };
  const priorUrl = process.env.SUPABASE_URL;
  const priorKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priorFetch = globalThis.fetch;
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test';
  globalThis.fetch = async () => ({
    ok: !duplicate,
    text: async () => JSON.stringify(duplicate ? { code: '23505' } : [{ id: 1 }])
  });
  try {
    await waitlistHandler({
      method: 'POST',
      body: { phone: '9876543210' },
      headers: {}
    }, response);
  } finally {
    globalThis.fetch = priorFetch;
    if (priorUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = priorUrl;
    if (priorKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorKey;
  }
  return response.body;
}

test('waitlist API distinguishes new signup from duplicate', async () => {
  assert.equal((await apiRequest(false)).created, true);
  assert.equal((await apiRequest(true)).created, false);
});
