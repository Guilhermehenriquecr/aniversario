const START = Date.parse('2026-09-22T10:00:00-03:00');
const END = Date.parse('2026-09-23T00:00:00-03:00');

export default async function middleware(request) {
  const path = new URL(request.url).pathname;
  if (path === '/acesso.html' || path === '/admin' || path === '/admin.html' || path.startsWith('/api/') || path === '/robots.txt' || path.startsWith('/_next/')) return;
  if (Date.now() >= START && Date.now() < END) return;
  return Response.redirect(new URL('/acesso.html', request.url), 307);
}

export const config = { matcher: '/(.*)' };
