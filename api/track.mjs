import crypto from 'node:crypto';
import { body, json, redis, redisConfigured } from './_lib/auth.mjs';

function device(ua = '') {
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'Celular';
  return 'Computador';
}

function headerValue(value) {
  try { return decodeURIComponent(value || ''); } catch { return value || ''; }
}

export async function POST(req) {
  if (!redisConfigured()) return json({ ok: false, setup: true });
  const input = await body(req);
  const ua = req.headers.get('user-agent') || '';
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || 'unknown';
  const ipHash = crypto.createHash('sha256').update(`${process.env.ADMIN_SECRET || 'aniver'}:${ip}`).digest('hex').slice(0, 16);
  const event = {
    id: crypto.randomUUID(),
    type: String(input.type || 'opened').slice(0, 24),
    sessionId: String(input.sessionId || '').slice(0, 80),
    sequence: Number.isInteger(Number(input.sequence)) ? Number(input.sequence) : null,
    seenAt: typeof input.seenAt === 'string' && !Number.isNaN(Date.parse(input.seenAt)) ? input.seenAt : null,
    slide: Number.isFinite(Number(input.slide)) ? Number(input.slide) : null,
    totalSlides: Number.isFinite(Number(input.totalSlides)) ? Number(input.totalSlides) : null,
    at: new Date().toISOString(),
    city: headerValue(req.headers.get('x-vercel-ip-city')) || 'Desconhecida',
    region: headerValue(req.headers.get('x-vercel-ip-country-region')),
    country: headerValue(req.headers.get('x-vercel-ip-country')),
    device: device(ua),
    userAgent: ua.slice(0, 240),
    ipHash,
    width: Number(input.width) || null,
    height: Number(input.height) || null
  };
  await redis('lpush', ['aniver:events', JSON.stringify(event)]);
  await redis('ltrim', ['aniver:events', 0, 4999]);
  return json({ ok: true });
}
