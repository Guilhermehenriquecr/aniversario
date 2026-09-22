import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POST as login } from '../api/admin-login.mjs';
import { GET as events } from '../api/admin-events.mjs';
import { POST as track } from '../api/track.mjs';

test('painel autenticado não gera eventos de abertura', async () => {
  const response = await login(new Request('https://example.test/api/admin-login', {
    method: 'POST', body: JSON.stringify({ user: 'guilherme', password: 'bregadeira' })
  }));
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  const { token } = await response.json();
  const existingSession = await events(new Request('https://example.test/api/admin-events', {
    headers: { authorization: `Bearer ${token}` }
  }));
  assert.match(existingSession.headers.get('set-cookie'), /aniver_admin=/);

  const oldUrl = process.env.KV_REST_API_URL;
  const oldToken = process.env.KV_REST_API_TOKEN;
  const oldFetch = globalThis.fetch;
  let calls = 0;
  try {
    process.env.KV_REST_API_URL = 'https://redis.example.test';
    process.env.KV_REST_API_TOKEN = 'test';
    globalThis.fetch = async () => { calls++; throw new Error('não deve salvar evento'); };
    const result = await track(new Request('https://example.test/api/track', {
      method: 'POST', headers: { cookie: cookie.split(';')[0] }, body: JSON.stringify({ type: 'opened' })
    }));
    assert.equal(result.status, 200);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldUrl === undefined) delete process.env.KV_REST_API_URL; else process.env.KV_REST_API_URL = oldUrl;
    if (oldToken === undefined) delete process.env.KV_REST_API_TOKEN; else process.env.KV_REST_API_TOKEN = oldToken;
  }
});

test('abertura só é registrada após acesso liberado para iniciar a experiência', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const admin = readFileSync(new URL('../admin.html', import.meta.url), 'utf8');
  const tracking = source.slice(source.indexOf('const RASTREAMENTO'), source.indexOf('/* ---------- O ROTEIRO'));
  const start = source.slice(source.indexOf("getElementById('comecar-com-som').addEventListener"), source.indexOf('if (MODO_TESTE) {', source.indexOf("getElementById('comecar-com-som').addEventListener")));
  assert.doesNotMatch(tracking, /enviar\('opened'\)/);
  assert.match(start, /RASTREAMENTO\.enviar\('opened'\)/);
  assert.doesNotMatch(admin, /(?:src="app\.js"|\/api\/track)/);
});
