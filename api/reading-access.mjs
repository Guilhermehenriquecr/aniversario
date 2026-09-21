import { json, redis, redisConfigured } from './_lib/auth.mjs';

const KEY = 'aniver:global-readings';
const LIMIT = 3;

export async function POST() {
  if (!redisConfigured()) return json({ ok: false, setup: true }, 503);
  const used = await redis('eval', [
    'local current=tonumber(redis.call("GET",KEYS[1]) or "0"); if current>=tonumber(ARGV[1]) then return -1 end; return redis.call("INCR",KEYS[1]);',
    1,
    KEY,
    LIMIT
  ]);
  const count = Number(used);
  if (count < 0) return json({ allowed: false, remaining: 0 });
  return json({ allowed: true, remaining: Math.max(0, LIMIT - count) });
}
