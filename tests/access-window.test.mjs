import { test } from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import { POST } from '../api/reading-access.mjs';

async function at(iso, action) {
  const original = Date.now;
  Date.now = () => Date.parse(iso);
  try { return await action(); } finally { Date.now = original; }
}

test('permite abrir repetidas vezes no dia 22 sem consumir vagas', async () => {
  await at('2026-09-22T11:00:00-03:00', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await POST();
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { allowed: true, remaining: 3 });
    }
    assert.equal(await middleware(new Request('https://flavia37.vercel.app/')), undefined);
  });
});

test('fecha novas aberturas após 23:59:59 de São Paulo, inclusive no dia seguinte', async () => {
  await at('2026-09-22T23:59:59-03:00', async () => {
    assert.equal((await POST()).status, 200);
  });
  for (const iso of ['2026-09-23T00:00:00-03:00', '2026-09-23T11:00:00-03:00']) {
    await at(iso, async () => {
      const response = await POST();
      assert.equal(response.status, 403);
      assert.deepEqual(await response.json(), { allowed: false, remaining: 0 });
      const page = await middleware(new Request('https://flavia37.vercel.app/'));
      assert.equal(page.status, 307);
      assert.equal(page.headers.get('location'), 'https://flavia37.vercel.app/acesso.html');
    });
  }
});
