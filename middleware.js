import { isOpen } from './access-window.mjs';

export default async function middleware(request) {
  const path = new URL(request.url).pathname;
  if (path === '/acesso.html' || path === '/admin' || path === '/admin.html' || path.startsWith('/api/') || path === '/robots.txt' || path.startsWith('/_next/')) return;
  if (isOpen()) return;
  return Response.redirect(new URL('/acesso.html', request.url), 307);
}

export const config = { matcher: '/(.*)' };
