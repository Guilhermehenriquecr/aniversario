import { failIfUnauthorized, json, redis, redisConfigured } from './_lib/auth.mjs';

export async function GET(req) {
  const denied = failIfUnauthorized(req);
  if (denied) return denied;
  if (!redisConfigured()) return json({ setup: true, events: [] });
  const raw = await redis('lrange', ['aniver:events', 0, 4999]);
  const events = (raw || []).flatMap((item) => { try { return [JSON.parse(item)]; } catch { return []; } });
  return json({ setup: false, events });
}
