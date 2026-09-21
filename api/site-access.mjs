import crypto from 'node:crypto';

const PASSWORD = process.env.SITE_ACCESS_PASSWORD || 'bregadeira';
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

export async function POST(req) {
  const input = await req.json().catch(() => ({}));
  if (input.password !== PASSWORD) return new Response(JSON.stringify({ error: 'Senha incorreta.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  const exp = endOfTodaySaoPaulo();
  const signature = crypto.createHmac('sha256', SECRET).update(String(exp)).digest('base64url');
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'content-type': 'application/json',
      'set-cookie': `aniver-access=${exp}.${signature}; Max-Age=${Math.max(1, Math.floor((exp - Date.now()) / 1000))}; Path=/; HttpOnly; Secure; SameSite=Lax`
    }
  });
}
