import { ADMIN_PASSWORD, ADMIN_USER, adminCookie, body, json, sign } from './_lib/auth.mjs';

export async function POST(req) {
  const input = await body(req);
  if (input.user !== ADMIN_USER || input.password !== ADMIN_PASSWORD) return json({ error: 'Login ou senha inválidos.' }, 401);
  const token = sign({ sub: ADMIN_USER });
  const response = json({ token });
  response.headers.set('set-cookie', adminCookie(token));
  return response;
}

export function GET() { return json({ ok: true }); }
