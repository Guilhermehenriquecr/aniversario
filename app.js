/* =========================================================
   22 de setembro, experiência de leitura única

   Editar o texto:  mexa só em ROTEIRO
   Pré-visualizar as cenas:  ?teste=1
   Pular direto para uma cena:  ?teste=1&ir=12
   ========================================================= */

const CONFIG = {
  leituras: 3,                      // número exibido na mensagem, sem limite de aberturas
  mostrarAssinaturaDoTexto: true,   // revela o acróstico com o seu nome
  mostrarContadorNoInicio: true,    // "3 leituras restantes" na primeira tela
  mostrarVersos: false,             // a tela dos seis versos com o acróstico do nome dela
  som: true,                        // música e som de digitação
  digitar: false,                   // pensamentos completos entram em sequência
  ritmoDigitacao: 230,              // leitura média por palavra
  volumeMusica: 0.42,               // de 0 a 1
  volumeDigitacao: 0.2              // de 0 a 1
};

/* ---------- acompanhamento privado ---------- */
const RASTREAMENTO = (() => {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return { enviar() {} };
  let sessionId = '';
  let sequencia = 0;
  let fila = Promise.resolve();
  try {
    sessionId = sessionStorage.getItem('aniver:session') || crypto.randomUUID();
    sessionStorage.setItem('aniver:session', sessionId);
  } catch { sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
  const enviar = (type, extra = {}) => {
    const payload = { type, sessionId, sequence: ++sequencia, seenAt: new Date().toISOString(), width: innerWidth, height: innerHeight, ...extra };
    fila = fila.catch(() => {}).then(() => fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }));
  };
  enviar('opened');
  return { enviar };
})();

/* ---------- O ROTEIRO ---------- */

const ROTEIRO = [
  {
    id: 'abertura',
    contador: true,
    botao: 'Vamos',
    linhas: [
      { t: 'Olá, Flávia.', e: 'nome' },
      { t: 'Hoje é 22 de setembro.', e: 'suave' },
      { t: 'Antes de começar, um detalhe: esta mensagem foi feita para durar só o tempo da leitura. Quando você chegar ao fim, ela desaparece.', e: 'aviso' },
      { t: 'Você terá 3 vezes para assistir a ela, até o fim de hoje.', e: 'suave' },
      { t: 'Senta. Vai com calma. Isso é sobre você.', e: 'forte' }
    ]
  },
  {
    id: 'nome',
    linhas: [
      { t: 'Flávia vem do latim.' },
      { t: 'Significa a dourada. A que tem cabelo de ouro.' },
      { t: 'Mas quem te registrou não escolheu uma cor. Escolheu uma temperatura.' },
      { t: 'Você nunca foi dourada de cabelo. Você é dourada de luz. Daquelas que a gente percebe antes de entender de onde vêm.', e: 'forte' }
    ]
  },
  {
    id: 'dia',
    linhas: [
      { t: '22 de setembro de 1989. Uberlândia, Minas Gerais.' },
      { t: 'No fim da noite daquele dia, o sol cruzou a linha do equador e a primavera começou no Brasil.' },
      { t: 'Foi no mesmo dia em que você chegou ao mundo. A primavera começou junto, como se o calendário tivesse guardado um sinal só seu.' }
    ]
  },
  {
    id: 'proposito',
    linhas: [
      { t: 'Mas eu acho que combinou. Ao longo dos últimos anos, sua vida foi sobre recomeçar, se ancorar em um propósito e seguir em frente.', e: 'forte' }
    ]
  },
  {
    id: 'travessia',
    linhas: [
      { t: 'Eu não sei de tudo que você atravessou.' },
      { t: 'Mesmo depois de tantas conversas sobre a vida, eu ainda conheço apenas partes do que você atravessou.' },
      { t: 'Você me contou pedaços. Alguns eu entendi. Outros eu ouvi sem entender, achando que estava entendendo.' }
    ]
  },
  {
    id: 'nuncaDesistiu',
    linhas: [
      { t: 'Mas tem uma coisa que eu vi com meus olhos, e que eu não esqueço: você nunca parou e nunca desistiu.', e: 'forte' }
    ]
  },
  {
    id: 'forca',
    linhas: [
      { t: 'Eu não sei o preço que você pagou por cada uma dessas coisas.', e: 'suave' },
      { t: 'E ninguém te deu medalha por nenhuma delas.', e: 'forte' }
    ]
  },
  {
    id: 'julia',
    linhas: [
      { t: 'Em 2009, a vida colocou uma vida inteira nas suas mãos.' },
      { t: 'Júlia.' },
      { t: 'Você tinha dezenove anos. Poucos anos de diferença da idade dela hoje.' },
      { t: 'E ela cresceu. Mesmo sem saber direito o que fazer, você não deixou de estar lá.', e: 'forte' }
    ]
  },
  {
    id: 'maeLeoa',
    linhas: [
      { t: 'E hoje é uma excelente mãe, como eu dizia: uma mãe leoa.', e: 'forte' }
    ]
  },
  {
    id: 'fabio',
    linhas: [
      { t: 'Sete anos depois, você fez de novo.' },
      { t: 'Fábio.' },
      { foto: 'fabio.jpeg', alt: 'Fábio posando em uma estrutura de jogador de futebol americano.' },
      { t: 'Você já sabia o que era. Já conhecia a sensação do amor mais profundo e perfeito que existe. Já tinha cicatriz. E escolheu outra vez. Amar de novo, confiar de novo, começar de novo.' },
      { t: 'É por isso que eu digo: você é uma mulher de primaveras.', e: 'forte' }
    ]
  },
  {
    id: 'depois',
    // A tela do câncer. Se você preferir sem a palavra, é só trocar
    // 'Depois do Fábio veio o câncer.' por 'Depois do Fábio veio a notícia
    // que muda a vida de qualquer pessoa.'
    linhas: [
      { t: 'E aí veio mais uma provação.' },
      { t: 'Depois do Fábio, veio o câncer.' },
      { t: 'Eu não sei como foram os dias por dentro disso, nem o que você ouviu ou chorou quando ninguém estava vendo.' }
    ]
  },
  {
    id: 'recomeco',
    linhas: [
      { t: 'Mas, do outro lado, estava você: de pé, inteira, com dois filhos e uma vida para cuidar.', e: 'forte' },
      { t: 'Você atravessou isso do jeito que conseguiu. E, ainda assim, continuou encontrando caminhos para recomeçar.', e: 'forte' }
    ]
  },
  {
    id: 'forca',
    linhas: [
      { t: 'Tem gente que acha que gente forte é a que nunca cai.' },
      { t: 'Não é. Gente forte é a que conhece o chão e ainda assim escolhe levantar.' },
      { t: 'Você conhece o chão, Flávia.' },
      { t: 'E levantou sem virar amarga. Essa é a parte mais difícil. E é a parte que você acertou.', e: 'forte' }
    ]
  },
  {
    id: 'entrada',
    linhas: [
      { t: 'Agora deixa eu entrar na história. Porque essa parte tem a minha letra.', e: 'forte' }
    ]
  },
  {
    id: 'fevereiro',
    confete: true,
    linhas: [
      { t: 'Sábado, 7 de fevereiro de 2026. Folia Goiás, Avenida 85, Goiânia.' },
      { t: 'Trezentas e cinquenta mil pessoas na rua.', e: 'forte' }
    ]
  },
  {
    id: 'encontroFolia',
    linhas: [
      { t: 'E dentre trezentas e cinquenta mil, Deus nos colocou à frente.', e: 'forte' }
    ]
  },
  {
    id: 'futuroFolia',
    linhas: [
      { t: 'Era uma das datas que eu mais amo no ano. Eu ainda não sabia que, a partir daquele momento, viveria grandes momentos.', e: 'suave' }
    ]
  },
  {
    id: 'depoisCarnaval',
    linhas: [
      { t: 'O que era pra ser um simples beijo se tornou dias seguidos de conversas, do bom-dia ao boa-noite.' }
    ]
  },
  {
    id: 'rotinaJuntos',
    linhas: [
      { t: 'O tempo foi passando, começamos a dividir nossa rotina e, quando percebemos, éramos parte um do outro.' }
    ]
  },
  {
    id: 'rotinaDela',
    linhas: [
      { t: 'Nossas rotinas se cruzaram: você na correria da loja, lidando com diferentes tipos de pessoas.' }
    ]
  },
  {
    id: 'responsabilidade',
    linhas: [
      { t: 'Resolvendo problemas da sua casa, carregando a responsabilidade de mãe.' }
    ]
  },
  {
    id: 'rotinaMinha',
    linhas: [
      { t: 'Eu lidando com os mais variados números, meus projetos, meu mestrado e todas as minhas responsabilidades.' }
    ]
  },
  {
    id: 'sintonia',
    linhas: [
      { t: 'E, mesmo assim, nossa sintonia continuava sólida.', e: 'forte' }
    ]
  },
  {
    id: 'apelido',
    linhas: [
      { t: 'Você tinha um nome só seu pra me chamar.' },
      { t: '🧩', e: 'emoji' },
      { t: 'Autistinha.', e: 'apelido' },
      { t: 'Às vezes eu ainda escuto esse nome, do nada. É estranho como um jeito de chamar alguém pode continuar vivo, mesmo quando a vida segue por caminhos diferentes.', e: 'forte' }
    ]
  },
  {
    id: 'ensinou',
    linhas: [
      { t: 'Eu não saí dessa história com nada que caiba na mão.' },
      { t: 'Saí com aprendizado.' }
    ]
  },
  {
    id: 'planoJK',
    linhas: [
      { t: 'Diria que você foi o Plano JK na minha vida: amadurecimento de uma vida em seis meses.', e: 'forte' }
    ]
  },
  {
    id: 'tempoOutro',
    linhas: [
      { t: 'Aprendi a entender o tempo das outras pessoas, que quase nunca é o meu.' }
    ]
  },
  {
    id: 'posicionamento',
    linhas: [
      { t: 'Aprendi a me posicionar melhor e descobri um poder pessoal dentro de mim que eu nunca tinha visto.' }
    ]
  },
  {
    id: 'ensinamento',
    linhas: [
      { t: 'Você me ensinou essas coisas sem perceber. De graça.' }
    ]
  },
  {
    id: 'levar',
    linhas: [
      { t: 'E eu vou levar isso comigo pelo resto da vida.', e: 'forte' }
    ]
  },
  {
    id: 'parteruim',
    linhas: [
      { t: 'Teve a parte ruim também. E nós dois sabemos exatamente o que foi.' },
      { t: 'Não vou escrever isso pra parecer que foi só você. Nem pra parecer que foi só eu.' },
      { t: 'Meu erro, seu erro, nossos erros. Foram os três.', e: 'forte' }
    ]
  },
  {
    id: 'tatudobem',
    linhas: [
      { t: 'E tá tudo bem.', e: 'forte' },
      { t: 'Nada daquilo ficou de pé. Não sobrou mágoa, não sobrou cobrança, não sobrou vontade de acertar contas.' },
      { t: 'Hoje eu lembro de tudo e olho como uma baita lição.' }
    ]
  },
  {
    id: 'intercessao',
    linhas: [
      { foto: 'são miguel.jpg', classe: 'retrato-intercessao', alt: 'Imagem de São Miguel Arcanjo.' },
      { t: 'Fizemos um propósito de 30 dias em intercessão pelo nosso vínculo. Sim, nós fizemos de tudo.', e: 'forte' }
    ]
  },
  {
    id: 'pirenopolisTentativa',
    linhas: [
      { t: 'Mas ser só amigo era muito pouco para tudo o que a gente sentia.', e: 'forte' }
    ]
  },
  {
    id: 'escolhaOutraVez',
    linhas: [
      { t: 'Sem um acordo, sem dizer em voz alta, resolvemos tentar de novo.' },
      { t: 'No fundo, nós dois sabíamos que provavelmente não iria funcionar. Ainda assim, por algum tempo, escolhemos tentar fazer acontecer novamente.', e: 'suave' }
    ]
  },
  {
    id: 'tentativa',
    linhas: [
      { t: 'E não deu.' },
      { t: 'Mas eu me recuso a guardar isso como fracasso.' },
      { t: 'Apesar de toda a carga que tinha, a gente provou. Fez valer a pena tentar.', e: 'forte' },
      { t: 'Isso não é uma história que deu errado. É uma história que foi até o fim.', e: 'forte' },
      { t: 'Infelizmente, não teve a briga de faca que a gente planejou. Essa é a única parte com que eu realmente não me conformei. Kkk.', e: 'suave' }
    ]
  },
  {
    id: 'distancia',
    linhas: [
      { t: 'Tem uma coisa que preciso te dizer.' },
      { t: 'Estou distante. Estou vivendo outro momento da minha vida.' },
      { t: 'Passei por mudanças e precisei sair por um tempo pelo mundo.' },
      { t: 'Perdi pessoas próximas em uma tragédia e, com tudo isso, aprendi a respeitar o silêncio.' }
    ]
  },
  {
    id: 'bonsDesejos',
    linhas: [
      { t: 'Prefiro continuar em silêncio, assentando minha nova vida e recebendo aquilo que há de melhor de Deus.' },
      { t: 'Torço para que a vida te trate com carinho, que seus caminhos se abram e que você continue encontrando paz.', e: 'forte' }
    ]
  },
  {
    id: 'encontro',
    linhas: [
      { t: 'No nosso último encontro, estavam você, eu e as duas pessoas que você chama de seu sentido.' },
      { t: 'Por dois dias, eu estive perto do que você tem de mais precioso. Me senti parte de uma família.' },
      { t: 'Foi uma lembrança bonita. Eu guardo com carinho a confiança que você colocou naquele momento.', e: 'forte' }
    ]
  },
  {
    id: 'gratidao',
    linhas: [
      { t: 'Eu lembro de você com admiração.' },
      { t: 'O que eu sinto hoje tem outra forma. Mas tudo o que foi bom ficou. Pode ter certeza disso.' },
      { t: 'Eu só queria deixar essas palavras aqui, com bastante sobriedade e maturidade sobre a nossa história.' }
    ]
  },
  {
    id: 'oracao',
    linhas: [
      { t: 'Eu oro por você, pela sua família, pelos seus filhos. Oro pra que onde você estiver, você esteja bem.', e: 'forte' },
      { t: 'Eu sei que você vai estar. Você sempre fica. Você é uma boa pessoa, eu sei disso.', e: 'forte' }
    ]
  },
  {
    id: 'fdeforca',
    linhas: [
      { t: 'Por muito tempo, pensei que esse F fosse de flores, porque você sempre encontrou um jeito de florescer.' },
      { t: 'Mas, olhando para a sua história, eu sei que ele é de outra coisa.' },
      { t: 'F, de Força.', e: 'nome' }
    ]
  },
];

/* A mensagem que ela recebeu no SMS, palavra por palavra. */
const TEXTO_DO_SMS = [
  'Grandes', 'universos', 'iluminam', 'longos', 'horizontes,',
  'enquanto', 'recomeços', 'mostram', 'escolhas;',
  'hoje', 'existem', 'novos', 'rumos,',
  'inspirações', 'que', 'unem', 'esperanças.'
];

/* Os seis versos que escondem o nome dela. */
const VERSOS = [
  'Foi num dia de primavera que o mundo ganhou você',
  'Levantou mais vezes do que caiu, e ninguém contou',
  'Às vezes faltou chão, e você continuou de pé',
  'Você fez de cada recomeço uma coisa mais bonita',
  'Insisto: o que você é, ninguém tira',
  'Aonde quer que eu vá, vou lembrar de você'
];

const VERSO_FINAL = 'Aonde quer que eu vá, vou levar seus ensinamentos e tudo de bom que vivemos.';

const MIDIA = {
  foto: 'midia/foto.jpg',
  video: 'midia/video.mp4',
  musica: 'midia/alianca.mp3',
  musicaDepois: 'Maneva - O Destino Não Quis (Ao Vivo Em São Paulo) - ManevaVEVO (youtube) (2).mp3',
  musicaPenultima: 'Marisa Monte - Depois - Sergio Ricardo (youtube).mp3',
  musicaFinal: 'São Amores - Forró do Muído (youtube).mp3'
};

/* =========================================================
   Estado
   ========================================================= */

const param = new URLSearchParams(location.search);
const MODO_TESTE = param.has('teste');
let estado = { restantes: CONFIG.leituras, destruida: false, inicio: Date.now() };

function lerEstado() {
  estado = { restantes: CONFIG.leituras, destruida: false, inicio: Date.now() };
}

function rotuloLeituras() {
  if (estado.restantes <= 0) return 'mensagem encerrada';
  return estado.restantes === 1 ? '1 leitura restante' : estado.restantes + ' leituras restantes';
}

/* =========================================================
   Base
   ========================================================= */

const palco = document.getElementById('palco');
const dica = document.getElementById('dica');
const brilho = document.getElementById('brilho');

const CAPITULOS = [
  ...ROTEIRO.flatMap((dados, i) => [
    { tipo: 'texto', i },
    ...(dados.id === 'futuroFolia' ? [
      { tipo: 'recorte' },
      ...(CONFIG.mostrarAssinaturaDoTexto ? [{ tipo: 'assinatura' }] : [])
    ] : []),
    ...(dados.id === 'tatudobem' ? [{ tipo: 'foto' }] : [])
  ]),
  ...(CONFIG.mostrarVersos ? [{ tipo: 'versos' }] : []),
  { tipo: 'video' },
  { tipo: 'felicitacoes' },
  { tipo: 'fim' }
];

let cena = null;
let capitulo = 0;
let ocupado = false;

function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto != null) n.textContent = texto;
  return n;
}

function ritmo(texto) {
  return Math.min(3400, 1000 + texto.length * 34);
}

/* Um item de cena que entra digitado. */
function itemDe(elemento, texto, pausa) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  const leitura = Math.max(1700, palavras * CONFIG.ritmoDigitacao + 900);
  return { el: elemento, texto: texto, espera: Math.min(9000, leitura), pausa: pausa || 1700 };
}

/* Reserva a altura final de cada linha antes de digitar, senão a cena
   cresce enquanto o texto entra e empurra tudo para cima. */
function reservarAltura(itens) {
  itens.forEach((it) => {
    if (it.texto == null) return;
    it.el.textContent = it.texto;
    const altura = it.el.offsetHeight;
    it.el.style.minHeight = altura + 'px';
    it.el.textContent = '';
  });
}

let cancelarDigitacao = null;

function digitar(elemento, texto, aoTerminar) {
  if (cancelarDigitacao) cancelarDigitacao();

  let i = 0;
  let cancelado = false;
  let relogio = null;
  const palavras = texto.match(/\S+\s*/g) || [];

  const completar = () => {
    cancelado = true;
    clearTimeout(relogio);
    elemento.textContent = texto;
    cancelarDigitacao = null;
  };

  const passo = () => {
    if (cancelado) return;
    if (i >= palavras.length) {
      cancelarDigitacao = null;
      if (aoTerminar) aoTerminar();
      return;
    }

    const bloco = palavras.slice(i, i + 4);
    i += bloco.length;
    const trechoTexto = bloco.join('');
    const trecho = el('span', 'palavra-leitura', trechoTexto);
    elemento.appendChild(trecho);
    const final = bloco[bloco.length - 1] || '';
    let pausa = CONFIG.ritmoDigitacao + Math.min(70, trechoTexto.trim().length * 3);
    if (/[,;:]\s*$/.test(final)) pausa += 350;
    else if (/[.!?]\s*$/.test(final)) pausa += 700;

    relogio = setTimeout(passo, pausa);
  };

  cancelarDigitacao = completar;
  passo();
}

function mostrarDica() {
  if (!cena) return;
  cena.pronto = true;
  Interface.pronto(cena.tipo === 'fim' ? 'Encerrar a mensagem' : cena.dados.botao);
  dica.classList.add('on');
}

function revelarProximo() {
  if (!cena || cena.completo) return;

  if (cena.indice >= cena.itens.length) { finalizar(); return; }

  const alvo = cena;
  const item = alvo.itens[alvo.indice++];
  item.el.classList.add('vis');
  manterVisivel(item.el);

  if (CONFIG.digitar && item.texto != null) {
    digitar(item.el, item.texto, () => {
      if (cena !== alvo || alvo.completo) return;
      setTimeout(() => { if (cena === alvo && !alvo.completo) revelarProximo(); }, item.pausa);
    });
    return;
  }

  if (item.manual) return;

  setTimeout(() => {
    if (cena === alvo && !alvo.completo) revelarProximo();
  }, CONFIG.digitar ? item.espera : Math.min(item.espera, 300));
}

/* Em telas baixas, garante que a última linha revelada continue à vista
   sem nunca empurrar o começo da cena para fora. */
function manterVisivel(elemento) {
  const alvoPalco = document.getElementById('palco');
  if (alvoPalco.scrollHeight <= alvoPalco.clientHeight + 40) return;
  setTimeout(() => {
    const caixa = alvoPalco.getBoundingClientRect();
    const r = elemento.getBoundingClientRect();
    const sobra = 96;
    const excesso = r.bottom - (caixa.bottom - sobra);
    if (excesso <= 0) return;

    // teto: a rolagem nunca pode empurrar o começo da cena para fora da tela
    const cenaEl = alvoPalco.firstElementChild;
    const topoDaCena = cenaEl
      ? cenaEl.getBoundingClientRect().top - caixa.top + alvoPalco.scrollTop
      : Infinity;

    const destino = Math.min(alvoPalco.scrollTop + excesso, topoDaCena);
    if (destino > alvoPalco.scrollTop + 4) {
      alvoPalco.scrollTo({ top: destino, behavior: 'smooth' });
    }
  }, 900);
}

function finalizar() {
  if (!cena || cena.completo) return;
  if (cancelarDigitacao) cancelarDigitacao();
  cena.completo = true;
  cena.indice = cena.itens.length;
  cena.itens.forEach((i) => {
    i.el.classList.add('vis');
    if (i.texto != null) i.el.textContent = i.texto;
  });
  if (cena.contadorEl) cena.contadorEl.classList.add('vis');
  cena.extras.forEach((f) => f());

  if (cena.apos) cena.apos();
  else setTimeout(mostrarDica, 350);
}

function pular() {
  if (!cena) return;
  if (cena.pularProprio) { cena.pularProprio(); return; }
  finalizar();
}

function montarTexto(i) {
  const dados = ROTEIRO[i];
  const caixa = el('div', 'cena');

  Particulas.modo(dados.confete ? 'confete' : 'poeira');

  const itens = dados.linhas.map((l) => {
    if (l.foto) {
      const cartao = el('div', 'foto-unica');
      const capa = el('button', 'foto-capa');
      capa.type = 'button';
      capa.setAttribute('aria-label', 'Revelar a foto do Fábio');
      capa.appendChild(el('span', 'foto-icone', '✦'));
      capa.appendChild(el('span', null, 'Toque para revelar'));
      const foto = el('img', 'midia ' + (l.classe || 'retrato-fabio'));
      foto.src = l.foto;
      foto.alt = l.alt;
      foto.width = 900;
      foto.height = 1600;
      cartao.appendChild(capa);
      cartao.appendChild(foto);
      caixa.appendChild(cartao);
      const item = { el: cartao, espera: 0, pausa: 1500, manual: true, revelar() {
        if (item.revelado) return;
        item.revelado = true;
        cartao.classList.add('aberto');
        foto.classList.add('vis');
      capa.setAttribute('aria-label', 'Imagem revelada');
        setTimeout(() => { if (cena && !cena.completo) revelarProximo(); }, item.pausa);
      }};
      capa.addEventListener('click', (ev) => { ev.stopPropagation(); item.revelar(); });
      return item;
    }
    const p = el('p', 'linha' + (l.e ? ' ' + l.e : ''), CONFIG.digitar ? '' : l.t);
    caixa.appendChild(p);
    return itemDe(p, l.t, (l.e === 'nome' || l.e === 'apelido') ? 1100 : 850);
  });

  const extras = [];
  if (dados.confete) extras.push(() => Particulas.rajada(20));

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  reservarAltura(itens);

  cena = { dados, tipo: 'texto', indice: 0, itens, extras, completo: false, el: caixa };

  if (dados.contador && CONFIG.mostrarContadorNoInicio) {
    const c = el('div', 'contador', rotuloLeituras());
    caixa.appendChild(c);
    cena.contadorEl = c;
  }

  revelarProximo();
}

/* ---------- a assinatura escondida no texto do SMS ---------- */

function montarAssinatura() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const intro = el('p', 'linha suave', 'A mensagem que você recebeu não era só uma mensagem.');
  caixa.appendChild(intro);

  const bloco = el('div', 'texto');
  caixa.appendChild(bloco);

  const iniciais = [];
  const palavras = TEXTO_DO_SMS.map((p) => {
    const s = el('span', 'palavra');
    const inicio = p.search(/[A-Za-zÀ-ÿ]/);
    if (inicio >= 0) {
      const inicial = el('span', 'letra-assinatura', p[inicio]);
      iniciais.push(inicial);
      s.appendChild(inicial);
      s.appendChild(document.createTextNode(p.slice(inicio + 1)));
    } else s.textContent = p;
    bloco.appendChild(s);
    return s;
  });

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  let fechado = false;
  let interrompido = false;

  const revelarPalavras = (tudo) => {
    palavras.forEach((p, i) => {
      if (tudo) p.classList.add('vis');
      else setTimeout(() => { if (!interrompido) p.classList.add('vis'); }, 85 * i);
    });
  };

  const fechar = () => {
    if (fechado) return;
    fechado = true;
    interrompido = true;
    palavras.forEach((p) => { p.classList.add('vis'); p.classList.add('acesa'); p.querySelector('.letra-assinatura')?.classList.add('acesa'); });

    const pista = el('p', 'linha suave assinatura-anuncio', 'Algumas respostas já estavam ali desde a primeira letra.');
    caixa.appendChild(pista);
    setTimeout(() => pista.classList.add('vis'), 360);

    const nome = el('div', 'assinatura assinatura-formacao');
    const letrasDoNome = [];
    ['GUILHERME', 'HENRIQUE'].forEach((parte, indice) => {
      const grupo = el('span', 'grupo-assinatura');
      [...parte].forEach((letra) => {
        const destino = el('span', 'letra-formada', letra);
        grupo.appendChild(destino);
        letrasDoNome.push(destino);
      });
      nome.appendChild(grupo);
      if (indice === 0) nome.appendChild(document.createTextNode(' '));
    });
    caixa.appendChild(nome);
    setTimeout(() => {
      nome.classList.add('vis');
      iniciais.forEach((letra) => letra.classList.add('entregue'));
      letrasDoNome.forEach((letra, i) => setTimeout(() => letra.classList.add('formada'), 100 * i));
    }, 720);

    const fim = el('p', 'linha forte assinatura-fecho', 'As iniciais guardavam um nome.');
    caixa.appendChild(fim);
    manterVisivel(fim);
    setTimeout(() => {
      fim.classList.add('vis');
      setTimeout(mostrarDica, 900);
    }, 2700);
  };

  const acender = () => {
    let i = 0;
    const passo = () => {
      if (interrompido) return;
      if (i >= palavras.length) { fechar(); return; }
      palavras[i].classList.add('acesa');
      palavras[i].querySelector('.letra-assinatura')?.classList.add('acesa');
      i++;
      setTimeout(passo, 165);
    };
    passo();
  };

  cena = {
    dados: { id: 'assinatura' },
    tipo: 'assinatura',
    indice: 0,
    itens: [{ el: intro, espera: 2400 }],
    extras: [],
    completo: false,
    semDica: true,
    el: caixa,
    apos: () => { revelarPalavras(false); setTimeout(acender, 85 * palavras.length + 1000); },
    pularProprio: () => {
      if (fechado) return;
      revelarPalavras(true);
      cena.completo = true;
      fechar();
    }
  };

  revelarProximo();
}

/* ---------- os seis versos que escondem o nome dela ---------- */

function montarVersos() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const intro = el('p', 'linha suave', 'Antes de você ir, tem uma última coisa. E ela é toda sua.');
  caixa.appendChild(intro);

  const bloco = el('div', 'versos');
  caixa.appendChild(bloco);

  const itens = [{ el: intro, espera: 2200 }];
  const letras = [];

  VERSOS.forEach((v) => {
    const p = el('p', 'verso');
    const letra = el('span', 'letra', v.slice(0, 1));
    p.appendChild(letra);
    p.appendChild(document.createTextNode(v.slice(1)));
    bloco.appendChild(p);
    letras.push(letra);
    itens.push({ el: p, espera: 1750 });
  });

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  let fechado = false;
  let interrompido = false;

  const acenderLetras = () => {
    let i = 0;
    const passo = () => {
      if (interrompido) return;
      if (i >= letras.length) { fechado = true; setTimeout(mostrarDica, 900); return; }
      letras[i].classList.add('acesa');
      i++;
      setTimeout(passo, 210);
    };
    passo();
  };

  cena = {
    dados: { id: 'versos' },
    tipo: 'versos',
    indice: 0,
    itens,
    extras: [],
    completo: false,
    semDica: true,
    el: caixa,
    apos: () => setTimeout(acenderLetras, 1200),
    pularProprio: () => {
      if (fechado) return;
      interrompido = true;
      itens.forEach((i) => i.el.classList.add('vis'));
      letras.forEach((l) => l.classList.add('acesa'));
      cena.completo = true;
      fechado = true;
      mostrarDica();
    }
  };

  revelarProximo();
}

/* ---------- o fim ---------- */

/* ---------- a foto ---------- */

/* ---------- o recorte de jornal ---------- */

function montarRecorte() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const antes = el('p', 'linha suave', CONFIG.digitar ? '' : 'E não é jeito de falar. Isso saiu no jornal no dia seguinte.');

  const recorte = el('div', 'recorte');
  recorte.appendChild(el('p', 'recorteCab', 'Goiânia · 7 de fevereiro de 2026'));
  recorte.appendChild(el('p', 'recorteTitulo', 'Goiânia registrou público recorde no Folia Goiás'));
  recorte.appendChild(el('div', 'recorteRegua'));
  recorte.appendChild(el('p', 'recorteTexto', 'Realizado neste sábado (07/02), na Avenida 85. A estimativa é de que mais de 350 mil pessoas tenham participado do pré-carnaval, que ocupou completamente a via e os espaços do entorno desde as primeiras horas da tarde. A presença maciça de foliões marcou o início da programação oficial do Carnaval 2026 no estado. A cidade ferveu e arrastou multidão inédita para a festa.'));

  const depois = el('p', 'linha forte', CONFIG.digitar ? '' : 'Trezentas e cinquenta mil pessoas na Avenida 85. E no meio de todas elas, você.');

  caixa.appendChild(antes);
  caixa.appendChild(recorte);
  caixa.appendChild(depois);

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  const itens = [
    itemDe(antes, 'E não é jeito de falar. Isso saiu no jornal no dia seguinte.'),
    { el: recorte, espera: 4200 },
    itemDe(depois, 'Trezentas e cinquenta mil pessoas na Avenida 85. E no meio de todas elas, você.', 1100)
  ];
  if (CONFIG.digitar) reservarAltura(itens);

  cena = {
    dados: { id: 'recorte' },
    tipo: 'recorte',
    indice: 0,
    itens,
    extras: [],
    completo: false,
    el: caixa
  };

  revelarProximo();
}

function montarFoto() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const antes = el('p', 'linha suave', CONFIG.digitar ? '' : 'Depois de um rompimento nosso, tentamos ser amigos.');
  const cartao = el('div', 'foto-unica');
  const capa = el('button', 'foto-capa');
  capa.type = 'button';
  capa.setAttribute('aria-label', 'Revelar a foto de Pirenópolis');
  capa.appendChild(el('span', 'foto-icone', '✦'));
  capa.appendChild(el('span', null, 'Toque para revelar'));
  const img = document.createElement('img');
  img.className = 'midia retrato-pirenopolis';
  img.src = MIDIA.foto;
  img.alt = 'Fotografia de uma lembrança em Pirenópolis.';
  img.decoding = 'async';
  cartao.appendChild(capa);
  cartao.appendChild(img);

  const depois = el('p', 'linha', CONFIG.digitar ? '' : 'Pirenópolis. Alguns dias rindo, andando e conversando, como se a amizade pudesse ser suficiente.');
  caixa.appendChild(antes);
  caixa.appendChild(cartao);
  caixa.appendChild(depois);

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  const itens = [
    itemDe(antes, 'Depois de um rompimento nosso, tentamos ser amigos.'),
    { el: cartao, espera: 0, pausa: 1500, manual: true, revelar() {
      if (this.revelado) return;
      this.revelado = true;
      cartao.classList.add('aberto');
      img.classList.add('vis');
      capa.setAttribute('aria-label', 'Foto de Pirenópolis revelada');
      setTimeout(() => { if (cena && !cena.completo) revelarProximo(); }, this.pausa);
    } },
    itemDe(depois, 'Pirenópolis. Alguns dias rindo, andando e conversando, como se a amizade pudesse ser suficiente.')
  ];
  itens[1].revelar = itens[1].revelar.bind(itens[1]);
  capa.addEventListener('click', (ev) => { ev.stopPropagation(); itens[1].revelar(); });
  if (CONFIG.digitar) reservarAltura(itens);

  cena = {
    dados: { id: 'foto' },
    tipo: 'foto',
    indice: 0,
    itens,
    extras: [],
    completo: false,
    el: caixa
  };

  // já vai aquecendo o vídeo enquanto ela olha a foto
  const aquecimento = document.createElement('video');
  aquecimento.preload = 'auto';
  aquecimento.muted = true;
  aquecimento.src = MIDIA.video;

  revelarProximo();
}

/* ---------- o vídeo ---------- */

function montarVideo() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const antes = el('p', 'linha suave', CONFIG.digitar ? '' : 'Sete segundos. É tudo que eu tenho de você em movimento.');

  // a bolha imita o "visualização única" do WhatsApp
  const bolha = el('div', 'zap');

  const capa = el('button', 'zapCapa');
  capa.type = 'button';
  capa.setAttribute('aria-label', 'Reproduzir a lembrança em vídeo');
  const icone = el('div', 'zapIcone');
  icone.appendChild(el('span', null, '1'));
  capa.appendChild(icone);
  capa.appendChild(el('p', 'zapTitulo', 'Uma lembrança em movimento'));
  capa.appendChild(el('p', 'zapDica', 'Toque para abrir'));
  bolha.appendChild(capa);

  const v = document.createElement('video');
  v.className = 'midia zapVideo';
  // o #t=0.1 força o Safari do iPhone a desenhar o primeiro quadro
  v.src = MIDIA.video + '#t=0.1';
  v.preload = 'metadata';
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
  v.controls = true;
  bolha.appendChild(v);

  const status = el('p', 'zapStatus', 'Uma lembrança guardada com carinho.');
  bolha.appendChild(status);

  const depois = el('p', 'linha forte', CONFIG.digitar ? '' : 'Show do Hugo e Guilherme. Curtimos bons momentos, e vivemos muita coisa em tão pouco tempo.');

  caixa.appendChild(antes);
  caixa.appendChild(bolha);
  caixa.appendChild(depois);

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  const itens = [
    itemDe(antes, 'Sete segundos. É tudo que eu tenho de você em movimento.'),
    { el: bolha, espera: 3200 },
    itemDe(depois, 'Show do Hugo e Guilherme. Curtimos bons momentos, e vivemos muita coisa em tão pouco tempo.', 1000)
  ];
  if (CONFIG.digitar) reservarAltura(itens);

  let destravado = false;

  const liberar = () => {
    if (destravado) return;
    destravado = true;
    bolha.classList.add('aberto');
    const p = v.play();
    if (p && p.catch) p.catch(() => { status.textContent = 'Use o play para assistir.'; bolha.classList.add('viu'); });
  };

  capa.addEventListener('click', (e) => { e.stopPropagation(); liberar(); });
  v.addEventListener('play', () => Trilha.reduzir(true));
  v.addEventListener('pause', () => Trilha.reduzir(false));

  v.addEventListener('ended', () => {
    Trilha.reduzir(false);
    bolha.classList.add('viu');
    if (cena && cena.completo) mostrarDica();
  });

  // se o vídeo realmente não carregar, ela nunca fica presa
  v.addEventListener('error', () => { destravado = true; status.textContent = 'Não foi possível carregar o vídeo. Você pode continuar.'; bolha.classList.add('viu'); if (cena && cena.completo) mostrarDica(); });
  const escape = setTimeout(() => {
    if (destravado) return;
    if (v.readyState === 0) { destravado = true; bolha.classList.add('viu'); if (cena && cena.completo) mostrarDica(); }
  }, 6000);

  cena = {
    dados: { id: 'video' },
    tipo: 'video',
    indice: 0,
    itens,
    extras: [],
    completo: false,
    el: caixa,
    apos: mostrarDica,
    trava: false,
    ficaDestravado: () => destravado,
    liberar,
    limpar: () => { clearTimeout(escape); v.pause(); Trilha.reduzir(false); }
  };

  revelarProximo();
}

function montarFim() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const l1 = el('p', 'linha nome', CONFIG.digitar ? '' : 'Feliz aniversário, Flávia.');
  const l2 = el('p', 'linha suave', CONFIG.digitar ? '' : 'Que a vida seja justa. E, se não for nesta, que em outra a gente se encontre mais uma vez.');
  caixa.appendChild(l1);
  caixa.appendChild(l2);

  palco.replaceChildren(caixa);
  dica.classList.remove('on');

  const itens = [
    itemDe(l1, 'Feliz aniversário, Flávia.', 1500),
    itemDe(l2, 'Que a vida seja justa. E, se não for nesta, que em outra a gente se encontre mais uma vez.', 2000)
  ];
  if (CONFIG.digitar) reservarAltura(itens);

  cena = {
    dados: { id: 'fim' },
    tipo: 'fim',
    indice: 0,
    itens,
    extras: [],
    completo: false,
    el: caixa
  };

  revelarProximo();
}

function montarFelicitacoes() {
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');
  const linhas = [
    ['Hoje, eu desejo que você encontre paz.', 'linha'],
    ['Que encontre sucesso e calmaria para a sua vida.', 'linha suave'],
    ['Sou grato pelo nosso encontro.', 'linha'],
    ['Que o seu dia seja repleto de felicidades.', 'linha forte']
  ].map(([texto, classe]) => {
    const p = el('p', classe, CONFIG.digitar ? '' : texto);
    caixa.appendChild(p);
    return itemDe(p, texto, 900);
  });
  palco.replaceChildren(caixa);
  dica.classList.remove('on');
  if (CONFIG.digitar) reservarAltura(linhas);
  cena = { dados: { id: 'felicitacoes' }, tipo: 'texto', indice: 0, itens: linhas, extras: [], completo: false, el: caixa };
  revelarProximo();
}

/* ---------- depois da destruição ---------- */

function montarResto(encerrada) {
  Interface.fim();
  const caixa = el('div', 'cena');
  Particulas.modo('poeira');

  const keep = el('p', 'linha forte', VERSO_FINAL);
  const flor = el('img', 'flor-final');
  flor.src = 'flor.svg';
  flor.alt = '';
  caixa.appendChild(flor);
  caixa.appendChild(keep);

  if (!encerrada && estado.restantes > 0) {
    caixa.appendChild(el('div', 'contador', rotuloLeituras()));
  }

  palco.replaceChildren(caixa);
  brilho.classList.remove('on');

  cena = {
    dados: { id: encerrada ? 'encerrada' : 'resto' },
    tipo: encerrada ? 'encerrada' : 'resto',
    indice: 1,
    itens: [{ el: keep, espera: 0 }],
    extras: [],
    completo: true,
    semDica: true,
    el: caixa
  };

  setTimeout(() => {
    keep.classList.add('vis');
    const c = caixa.querySelector('.contador');
    if (c) setTimeout(() => c.classList.add('vis'), 700);
  }, 500);
}

/* =========================================================
   Fluxo
   ========================================================= */

function montar(n) {
  capitulo = n;
  const cap = CAPITULOS[n];
  if (!cap) return;
  RASTREAMENTO.enviar('slide', { slide: n + 1, totalSlides: CAPITULOS.length });
  Interface.cena(cap.tipo === 'texto' ? ROTEIRO[cap.i].id : cap.tipo, n, CAPITULOS.length);
  palco.scrollTop = 0;
  if (cap.tipo === 'texto') montarTexto(cap.i);
  else if (cap.tipo === 'recorte') montarRecorte();
  else if (cap.tipo === 'foto') montarFoto();
  else if (cap.tipo === 'video') montarVideo();
  else if (cap.tipo === 'assinatura') montarAssinatura();
  else if (cap.tipo === 'versos') montarVersos();
  else if (cap.tipo === 'felicitacoes') montarFelicitacoes();
  else if (cap.tipo === 'fim') montarFim();
  palco.focus({ preventScroll: true });
}

function proximo() {
  if (capitulo + 1 >= CAPITULOS.length) return;
  ocupado = true;
  dica.classList.remove('on');
  if (cena && cena.limpar) cena.limpar();
  if (cena) cena.el.classList.add('sai');
  setTimeout(() => { ocupado = false; montar(capitulo + 1); }, 880);
}

function anterior() {
  if (ocupado || capitulo <= 0) return;
  ocupado = true;
  dica.classList.remove('on');
  if (cena && cena.limpar) cena.limpar();
  if (cena) cena.el.classList.add('sai');
  setTimeout(() => { ocupado = false; montar(capitulo - 1); }, 520);
}

function avancar() {
  if (ocupado || !cena) return;

  // A leitura precisa terminar sozinha; toques durante a digitação não pulam texto.
  if (!cena.completo || !cena.pronto) return;

  if (cena.trava && !cena.ficaDestravado()) { cena.liberar(); return; }

  if (cena.tipo === 'fim') { destruir(); return; }
  if (cena.tipo === 'resto' || cena.tipo === 'encerrada') return;

  proximo();
}

function destruir() {
  if (ocupado || !cena) return;
  ocupado = true;
  dica.classList.remove('on');

  cena.el.classList.add('queima');
  RASTREAMENTO.enviar('completed', { slide: capitulo + 1, totalSlides: CAPITULOS.length });
  Particulas.rajada(90);
  setTimeout(() => brilho.classList.add('on'), 1100);

  setTimeout(() => {
    montarResto(false);
    ocupado = false;
  }, 2500);
}

document.getElementById('continuar').addEventListener('click', avancar);
document.getElementById('voltar').addEventListener('click', anterior);
document.addEventListener('keydown', (e) => {
  if (e.target.closest('button, input, a, video') || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
    e.preventDefault();
    avancar();
  }
});

/* =========================================================
   Partículas
   ========================================================= */

const Particulas = (() => {
  const cv = document.getElementById('poeira');
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let lista = [];
  let modo = 'poeira';
  const rajadas = [];

  function dimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.width = Math.floor(innerWidth * dpr);
    h = cv.height = Math.floor(innerHeight * dpr);
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
  }

  function nascer(confete) {
    const dourado = Math.random() > .35;
    return {
      x: Math.random() * w,
      y: confete ? -30 * dpr - Math.random() * h * .5 : Math.random() * h,
      r: (confete ? 1.6 + Math.random() * 3.2 : .5 + Math.random() * 1.7) * dpr,
      vy: (confete ? .35 + Math.random() * .85 : -(.08 + Math.random() * .3)) * dpr,
      vx: (Math.random() - .5) * (confete ? .5 : .18) * dpr,
      a: .12 + Math.random() * .5,
      giro: (Math.random() - .5) * .04,
      ang: Math.random() * Math.PI,
      cor: (confete && !dourado)
        ? ['#e0bd7d', '#c98f5a', '#8f6fc4', '#e8e2d4'][(Math.random() * 4) | 0]
        : '#e0bd7d'
    };
  }

  function povoar() {
    const alvo = modo === 'confete' ? 150 : 90;
    lista = Array.from({ length: alvo }, () => nascer(modo === 'confete'));
  }

  function quadro() {
    ctx.clearRect(0, 0, w, h);
    const confete = modo === 'confete';

    for (const p of lista) {
      p.x += p.vx;
      p.y += p.vy;
      p.ang += p.giro;

      if (p.y < -50 * dpr) { p.y = h + 30 * dpr; p.x = Math.random() * w; }
      if (p.y > h + 50 * dpr) { p.y = -30 * dpr; p.x = Math.random() * w; }
      if (p.x < -50 * dpr) p.x = w + 30 * dpr;
      if (p.x > w + 50 * dpr) p.x = -30 * dpr;

      ctx.save();
      ctx.globalAlpha = p.a * (confete ? .85 : .55);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ang);
      ctx.fillStyle = p.cor;
      ctx.shadowColor = 'rgba(224,189,125,.75)';
      ctx.shadowBlur = (confete ? 6 : 10) * dpr;

      if (confete) {
        ctx.fillRect(-p.r, -p.r * .55, p.r * 2.4, p.r * 1.1);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (let i = rajadas.length - 1; i >= 0; i--) {
      const r = rajadas[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += .012 * dpr;
      r.vida -= .011;
      if (r.vida <= 0) { rajadas.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, r.vida) * .9;
      ctx.fillStyle = r.cor;
      ctx.shadowColor = 'rgba(224,189,125,.9)';
      ctx.shadowBlur = 12 * dpr;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(quadro);
  }

  function rajada(n) {
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const vel = (.5 + Math.random() * 4.2) * dpr;
      rajadas.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel,
        r: (.7 + Math.random() * 1.9) * dpr,
        vida: .6 + Math.random() * .6,
        cor: Math.random() > .3 ? '#f7e9c6' : '#c98f5a'
      });
    }
  }

  addEventListener('resize', () => { dimensionar(); povoar(); });
  dimensionar();
  povoar();
  quadro();

  return { modo(m) { if (m !== modo) { modo = m; povoar(); } }, rajada };
})();

/* =========================================================
   Som: um acorde longo, gerado no navegador
   ========================================================= */

const Trilha = (() => {
  const botao = document.getElementById('som');
  const musica = document.createElement('audio');
  musica.id = 'musica';
  musica.src = MIDIA.musica;
  musica.loop = false;
  musica.volume = CONFIG.volumeMusica;
  musica.preload = 'none';
  musica.style.display = 'none';
  document.body.appendChild(musica);

  let faixaAtual = 0;
  musica.addEventListener('ended', () => {
    if (faixaAtual === 0) {
      faixaAtual = 1;
      musica.src = MIDIA.musicaDepois;
      document.getElementById('faixa-nome').textContent = 'O Destino Não Quis · Maneva';
      musica.currentTime = 0;
      if (ligado) tocar();
    } else if (faixaAtual === 1) {
      faixaAtual = 2;
      musica.src = MIDIA.musicaPenultima;
      document.getElementById('faixa-nome').textContent = 'Depois · Marisa Monte';
      musica.currentTime = 0;
      if (ligado) tocar();
    } else if (faixaAtual === 2) {
      faixaAtual = 3;
      musica.src = MIDIA.musicaFinal;
      document.getElementById('faixa-nome').textContent = 'São Amores · Forró do Muído';
      musica.currentTime = 0;
      if (ligado) tocar();
    } else {
      ligado = false;
      atualizarBotao();
    }
  });

  let ctx = null, mestre = null, ruido = null;
  let ligado = false;
  let subindo = null;
  let reduzida = false;

  function atualizarBotao() {
    botao.hidden = false;
    botao.classList.toggle('mudo', !ligado);
    botao.setAttribute('aria-label', ligado ? 'Pausar música' : 'Reproduzir música');
    botao.setAttribute('aria-pressed', String(ligado));
  }
  function tocar() {
    musica.play().catch(() => {
      ligado = false;
      atualizarBotao();
      document.getElementById('faixa-nome').textContent = 'Toque no som para tentar novamente';
    });
  }
  musica.addEventListener('playing', () => {
    document.getElementById('faixa-nome').textContent = faixaAtual === 0 ? 'Aliança · Tribalistas' : faixaAtual === 1 ? 'O Destino Não Quis · Maneva' : faixaAtual === 2 ? 'Depois · Marisa Monte' : 'São Amores · Forró do Muído';
  });
  musica.addEventListener('error', () => {
    ligado = false;
    atualizarBotao();
    document.getElementById('faixa-nome').textContent = 'Áudio indisponível · toque para tentar';
  });
  document.getElementById('volume').addEventListener('input', e => {
    CONFIG.volumeMusica = Number(e.target.value) / 100;
    volumeDaMusica(ligado ? 1 : 0);
  });

  function montar() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    mestre = ctx.createGain();
    mestre.gain.value = 0;
    mestre.connect(ctx.destination);

    // estalo curtinho de tecla: ruído com decaimento rápido
    const n = Math.floor(ctx.sampleRate * 0.018);
    ruido = ctx.createBuffer(1, n, ctx.sampleRate);
    const dados = ruido.getChannelData(0);
    for (let i = 0; i < n; i++) {
      dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 7);
    }
  }

  /* O som de cada letra. Varia de altura e volume para não virar metralhadora. */
  function teco() {
    if (!ligado || !ctx || ctx.state !== 'running') return;
    if (Math.random() < 0.4) return;

    const fonte = ctx.createBufferSource();
    fonte.buffer = ruido;
    fonte.playbackRate.value = 0.8 + Math.random() * 0.55;

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 1250 + Math.random() * 1500;
    filtro.Q.value = 1.2;

    const g = ctx.createGain();
    g.gain.value = (0.32 + Math.random() * 0.42) * CONFIG.volumeDigitacao;

    fonte.connect(filtro);
    filtro.connect(g);
    g.connect(mestre);
    fonte.start();
  }

  function volumeDaMusica(v) {
    const alvo = v * CONFIG.volumeMusica * (reduzida ? 0.15 : 1);
    clearInterval(subindo);
    subindo = setInterval(() => {
      const d = alvo - musica.volume;
      if (Math.abs(d) < 0.02) {
        musica.volume = alvo;
        clearInterval(subindo);
        return;
      }
      musica.volume = Math.max(0, Math.min(1, musica.volume + d * 0.18));
    }, 80);
  }

  function ligar() {
    if (!CONFIG.som) return;
    if (!ctx) { try { montar(); } catch (e) { /* A música funciona sem som de teclas. */ } }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});

    ligado = true;
    if (mestre) {
      mestre.gain.cancelScheduledValues(ctx.currentTime);
      mestre.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.4);
    }

    tocar();
    volumeDaMusica(1);

    atualizarBotao();
  }

  function alternar() {
    ligado = !ligado;
    if (ligado) tocar();
    else musica.pause();
    if (ctx) {
      mestre.gain.cancelScheduledValues(ctx.currentTime);
      mestre.gain.linearRampToValueAtTime(ligado ? 1 : 0, ctx.currentTime + 0.4);
    }
    volumeDaMusica(ligado ? 1 : 0);
    atualizarBotao();
  }

  botao.addEventListener('click', (e) => { e.stopPropagation(); alternar(); });
  atualizarBotao();

  return { ligar, teco, reduzir(valor) { reduzida = valor; volumeDaMusica(ligado ? 1 : 0); } };
})();

/* =========================================================
   Início
   ========================================================= */

lerEstado();

const acordar = () => {
  Trilha.ligar();
  // a foto é leve: já vem enquanto ela lê as primeiras telas
  const aquecendo = new Image();
  aquecendo.src = MIDIA.foto;
};
document.getElementById('abrir-carta').addEventListener('click', () => {
  document.getElementById('capa').hidden = true;
  document.getElementById('trilha-intro').hidden = false;
}, { once: true });
let iniciandoLeitura = false;
document.getElementById('comecar-com-som').addEventListener('click', async () => {
  if (iniciandoLeitura) return;
  iniciandoLeitura = true;
  const botaoInicio = document.getElementById('comecar-com-som');
  botaoInicio.disabled = true;
  try {
    if (!MODO_TESTE) {
      const resposta = await fetch('/api/reading-access', { method: 'POST', cache: 'no-store' });
      const acesso = await resposta.json();
      if (!resposta.ok || !acesso.allowed) {
        estado = { restantes: 0, destruida: true, inicio: Date.now() };
        document.getElementById('trilha-intro').hidden = true;
        montarResto(true);
        return;
      }
      estado.restantes = Number(acesso.remaining) || 0;
    }
    document.getElementById('trilha-intro').hidden = true;
    acordar();
    montar(0);
  } catch {
    botaoInicio.disabled = false;
    iniciandoLeitura = false;
  }
});

if (MODO_TESTE) {
  const aviso = el('div', null, '');
  aviso.className = 'teste-aviso';
  document.body.appendChild(aviso);
  setInterval(() => { aviso.textContent = 'MODO TESTE · não conta · restam ' + estado.restantes; }, 500);
}

/* Espera as fontes carregarem antes de montar a primeira cena, senão a altura
   reservada de cada linha é medida com a fonte errada e o texto se desalinha. */
const fontesProntas = (document.fonts && document.fonts.ready)
  ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))])
  : Promise.resolve();

fontesProntas.then(() => {
  if (estado.destruida && !MODO_TESTE) {
    montarResto(true);
    return;
  }
  const salto = Number(param.get('ir'));
  if (MODO_TESTE && param.has('ir') && Number.isInteger(salto) && salto >= 0 && salto < CAPITULOS.length) {
    montar(salto);
  }
});
