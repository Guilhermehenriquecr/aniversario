/* Servidor local só para pré-visualizar.
   Uso:  node servidor.mjs   →   http://localhost:4173
   Não faz parte do site publicado. */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));
const porta = Number(process.env.PORTA || 4173);

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relativo = normalize(caminho === '/' ? '/index.html' : caminho).replace(/^(\.\.[/\\])+/, '');
  const arquivo = join(raiz, relativo);

  if (!arquivo.startsWith(raiz)) {
    res.writeHead(403).end('fora da raiz');
    return;
  }

  try {
    const info = await stat(arquivo);
    const tipo = tipos[extname(arquivo).toLowerCase()] || 'application/octet-stream';

    // Suporte a "range", igual ao da Vercel. Sem isso o Chrome não descobre a
    // duração de um MP3 e a música não consegue repetir.
    const faixa = req.headers.range;
    if (faixa && /^bytes=\d*-\d*$/.test(faixa)) {
      const [inicio, fim] = faixa.replace('bytes=', '').split('-');
      const de = inicio ? Number(inicio) : 0;
      const ate = fim ? Math.min(Number(fim), info.size - 1) : info.size - 1;
      const conteudo = await readFile(arquivo);
      res.writeHead(206, {
        'content-type': tipo,
        'content-length': ate - de + 1,
        'content-range': 'bytes ' + de + '-' + ate + '/' + info.size,
        'accept-ranges': 'bytes',
        'cache-control': 'no-store'
      });
      res.end(conteudo.subarray(de, ate + 1));
      return;
    }

    const conteudo = await readFile(arquivo);
    res.writeHead(200, {
      'content-type': tipo,
      'content-length': info.size,
      'accept-ranges': 'bytes',
      'cache-control': 'no-store'
    });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('não encontrado');
  }
}).listen(porta, () => {
  console.log('pré-visualização em http://localhost:' + porta + '?teste=1');
});
