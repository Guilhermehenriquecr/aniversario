const START = Date.parse('2026-09-22T10:00:00-03:00');
const END = Date.parse('2026-09-23T00:00:00-03:00');

export function isOpen(now = Date.now()) {
  return now >= START && now < END;
}
