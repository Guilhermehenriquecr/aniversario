import { ADMIN_PASSWORD, ADMIN_USER, body, json, sign } from './_lib/auth.mjs';

export async function POST(req) {
  const input = await body(req);
  if (input.user !== ADMIN_USER || input.password !== ADMIN_PASSWORD) return json({ error: 'Login ou senha inválidos.' }, 401);
  return json({ token: sign({ sub: ADMIN_USER }) });
}

export function GET() { return json({ ok: true }); }
