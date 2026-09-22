import { json } from './_lib/auth.mjs';
import { isOpen } from '../access-window.mjs';

export async function POST() {
  if (!isOpen()) return json({ allowed: false, remaining: 0 }, 403);
  return json({ allowed: true, remaining: 3 });
}
