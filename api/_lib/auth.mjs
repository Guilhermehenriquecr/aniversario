import crypto from 'node:crypto';

export const ADMIN_USER = process.env.ADMIN_USER || 'guilherme';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bregadeira';
const SECRET = process.env.ADMIN_SECRET || 'troque-esta-chave-no-vercel';

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export function body(req) {
  return req.json().catch(() => ({}));
}

export function sign(payload) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 86_400_000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function adminCookie(token) {
  return `aniver_admin=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`;
}

export function validSignedToken(token) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const expected = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(encoded, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}

export function validToken(req) {
  const header = req.headers.get('authorization') || '';
  return validSignedToken(header.startsWith('Bearer ') ? header.slice(7) : '');
}

export function redisConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function redis(command, args = []) {
  if (!redisConfigured()) throw new Error('KV_REST_API_URL e KV_REST_API_TOKEN não configuradas.');
  const url = `${process.env.KV_REST_API_URL.replace(/\/$/, '')}/${command.toLowerCase()}/${args.map((value) => encodeURIComponent(String(value))).join('/')}`;
  const response = await fetch(url, { headers: { authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` } });
  if (!response.ok) throw new Error(`Redis respondeu ${response.status}.`);
  const result = await response.json();
  return result.result;
}

export function failIfUnauthorized(req) {
  return validToken(req) ? null : json({ error: 'Não autorizado.' }, 401);
}
