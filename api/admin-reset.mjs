import { failIfUnauthorized, json, redis, redisConfigured } from './_lib/auth.mjs';

export async function POST(req) {
  const denied = failIfUnauthorized(req);
  if (denied) return denied;
  if (!redisConfigured()) return json({ setup: true });
  await redis('del', ['aniver:events']);
  return json({ ok: true });
}
