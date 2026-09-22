import { adminCookie, failIfUnauthorized, json, redis, redisConfigured } from './_lib/auth.mjs';

export async function GET(req) {
  const denied = failIfUnauthorized(req);
  if (denied) return denied;
  let result;
  if (!redisConfigured()) result = json({ setup: true, events: [] });
  else {
    const raw = await redis('lrange', ['aniver:events', 0, 4999]);
    const events = (raw || []).flatMap((item) => { try { return [JSON.parse(item)]; } catch { return []; } });
    result = json({ setup: false, events });
  }
  result.headers.set('set-cookie', adminCookie(req.headers.get('authorization').slice(7)));
  return result;
}
