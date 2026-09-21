const SECRET = process.env.SITE_ACCESS_SECRET || process.env.ADMIN_SECRET || 'aniver-site-access-secret';

function endOfTodaySaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const year = parts.find((p) => p.type === 'year').value;
  const month = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;
  return Date.parse(`${year}-${month}-${day}T23:59:59-03:00`);
}

async function validCookie(value) {
  const [exp, signature] = String(value || '').split('.');
  if (!exp || !signature || Number(exp) < Date.now()) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const normalized = signature.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(exp));
}

export default async function middleware(request) {
  const path = new URL(request.url).pathname;
  if (path === '/acesso.html' || path.startsWith('/api/') || path === '/robots.txt' || path.startsWith('/_next/')) return;
  if (Date.now() > endOfTodaySaoPaulo()) return;
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)aniver-access=([^;]+)/)?.[1];
  if (await validCookie(cookie)) return;
  return Response.redirect(new URL('/acesso.html', request.url), 307);
}

export const config = { matcher: '/(.*)' };
