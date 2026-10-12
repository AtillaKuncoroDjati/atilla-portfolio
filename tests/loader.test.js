import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/loader.js', import.meta.url), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function fixture({ seen = false, reduced = false, assets = 'ready', blockedStorage = false, bootDelay = 0 } = {}) {
  const classes = () => {
    const values = new Set();
    return { add: value => values.add(value), remove: value => values.delete(value), contains: value => values.has(value) };
  };
  const root = { classList: classes(), dataset: {}, lang: 'id' };
  const overlay = Object.assign(new EventTarget(), { classList: classes(), removed: 0, remove() { this.removed++; } });
  const skip = Object.assign(new EventTarget(), { firstChild: { nodeValue: 'Masuk sekarang ' } });
  const status = {};
  const background = [{ inert: false }, { inert: true }, { inert: false }];
  const window = new EventTarget();
  const media = Object.assign(new EventTarget(), { matches: reduced });
  const document = new EventTarget();
  let readyEvents = 0;
  document.addEventListener('portfolio:ready', () => readyEvents++);
  const storage = new Map(seen ? [['portfolio-intro-v2','seen']] : []);
  let resolveAsset;
  const asset = assets === 'pending' ? new Promise(resolve => { resolveAsset = resolve; }) : assets === 'failed' ? () => Promise.reject(new Error('offline')) : () => Promise.resolve();
  const waitAsset = () => typeof asset === 'function' ? asset() : asset;
  Object.assign(document, {
    documentElement: root,
    querySelector: selector => ({ '#page-loader': overlay, '#loader-status': status, '#loader-skip': skip, '.hero-portrait-image': { decode: waitAsset } })[selector],
    querySelectorAll: () => background,
    fonts: { load: waitAsset }
  });
  let now = bootDelay;
  let id = 0;
  const timers = new Map();
  const setTimeout = (callback, delay) => { timers.set(++id, { callback, at: now + delay }); return id; };
  const clearTimeout = timer => timers.delete(timer);
  function advance(milliseconds) {
    const end = now + milliseconds;
    while (true) {
      const due = [...timers].filter(([,timer]) => timer.at <= end).sort((a,b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]); now = due[1].at; due[1].callback();
    }
    now = end;
  }
  runInNewContext(source, {
    document, window, matchMedia: () => media, performance: { now: () => now }, Event,
    setTimeout, clearTimeout,
    sessionStorage: {
      getItem: key => { if (blockedStorage) throw new Error('blocked'); return storage.get(key); },
      setItem: (key,value) => { if (blockedStorage) throw new Error('blocked'); storage.set(key,value); }
    }
  });
  return { overlay, skip, root, media, window, background, storage, advance, resolveAsset, readyEvents: () => readyEvents };
}

function assertUsable(page) {
  assert.equal(page.overlay.removed, 1);
  assert.equal(page.root.dataset.introReady, 'true');
  assert.equal(page.root.classList.contains('intro-loading'), false);
  assert.deepEqual(page.background.map(node => node.inert), [false,true,false]);
  assert.equal(page.readyEvents(), 1);
}

test('stalled font and portrait cannot block the portfolio for two seconds', async () => {
  const page = fixture({ assets: 'pending' });
  await flush();
  assert.equal(page.background[0].inert, true);
  page.advance(1820);
  assertUsable(page);
  page.resolveAsset(); await flush();
  assertUsable(page);
});

test('failed assets still reveal the page and notify the hero animation once', async () => {
  const page = fixture({ assets: 'failed' });
  await flush(); page.advance(1270);
  assertUsable(page);
});

test('returning within the same session opens without another loading screen', () => {
  const page = fixture({ seen: true });
  assertUsable(page);
});

test('reduced motion opens immediately and changing the preference also releases the page', () => {
  assertUsable(fixture({ reduced: true }));
  const page = fixture({ assets: 'pending' });
  page.media.dispatchEvent(Object.assign(new Event('change'), { matches: true }));
  assertUsable(page);
});

test('skip works before assets load and late responses do not replay the entrance', async () => {
  const page = fixture({ assets: 'pending' });
  page.skip.dispatchEvent(new Event('click'));
  assertUsable(page);
  page.resolveAsset(); await flush(); page.advance(4000);
  assertUsable(page);
});

test('blocked session storage still leaves the page usable', async () => {
  const page = fixture({ blockedStorage: true });
  await flush(); page.advance(1270);
  assertUsable(page);
});

test('leaving the page releases background controls before a browser history restore', () => {
  const page = fixture({ assets: 'pending' });
  page.window.dispatchEvent(new Event('pagehide'));
  assertUsable(page);
});

test('late JavaScript does not lock the page after the CSS fallback has revealed it', () => {
  assertUsable(fixture({ bootDelay: 2500, assets: 'pending' }));
});
