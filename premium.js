/* Interface da carta: os controles respeitam o término de cada cena. */
const Interface = (() => {
  const bouton = document.getElementById('continuar');
  const voltar = document.getElementById('voltar');
  const statut = document.getElementById('leitura-status');
  const titres = {
    abertura:'Antes de começar', nome:'A sua luz', dia:'A primavera', travessia:'A sua força',
    julia:'Júlia', fabio:'Fábio', depois:'As travessias', recomeco:'De pé, outra vez', forca:'De pé, outra vez',
    entrada:'A nossa história', fevereiro:'Onde tudo começou', recorte:'Uma noite para lembrar', depoisCarnaval:'Do bom-dia ao boa-noite',
    apelido:'Um jeito só seu', ensinou:'O que ficou', parteruim:'Nós dois', tatudobem:'E tá tudo bem',
    foto:'Pirenópolis', tentativa:'Valeu a pena', primavera:'A primavera volta', distancia:'Com calma',
    encontro:'Parte de uma família', gratidao:'Com carinho', fdeforca:'F, de força',
    assinatura:'Entre as palavras', versos:'O seu nome', video:'Sete segundos', felicitacoes:'Com os melhores desejos', fim:'Para você'
  };
  function cena(id, indice, total) {
    document.getElementById('capa').hidden = true;
    document.getElementById('leitura').hidden = false;
    document.getElementById('player').hidden = false;
    document.getElementById('capitulo-titulo').textContent = titres[id] || 'Uma lembrança';
    document.getElementById('capitulo-numero').textContent = String(indice + 1).padStart(2,'0') + ' / ' + total;
    document.getElementById('progresso').value = indice / total * 100;
    bouton.hidden = false;
    bouton.disabled = true;
    voltar.hidden = indice === 0;
    voltar.disabled = indice === 0;
    bouton.textContent = 'Leia com calma';
    statut.textContent = 'Uma história, no seu tempo.';
  }
  function pronto(label) {
    bouton.disabled = false;
    bouton.textContent = label || 'Continuar →';
    const palco = document.getElementById('palco');
    statut.textContent = palco.scrollHeight > palco.clientHeight + 8 ? 'Role para ler · continue no seu tempo.' : 'Continue no seu tempo.';
  }
  function fim() {
    document.getElementById('capa').hidden = true;
    document.getElementById('leitura').hidden = false;
    document.getElementById('capitulo-titulo').textContent = 'A primavera permanece';
    document.getElementById('capitulo-numero').textContent = '22 / 09';
    document.getElementById('progresso').value = 100;
    bouton.hidden = true;
    voltar.hidden = false;
    voltar.disabled = false;
    statut.textContent = 'A primavera permanece.';
  }
  document.getElementById('tamanho-texto').addEventListener('click', e => {
    const grande = document.body.classList.toggle('texto-grande');
    e.currentTarget.setAttribute('aria-pressed', String(grande));
    e.currentTarget.setAttribute('aria-label', grande ? 'Usar texto padrão' : 'Aumentar texto');
  });
  return { cena, pronto, fim };
})();

/* Dissuasão de capturas casuais. O sistema operacional ainda pode capturar a tela. */
(() => {
  const ocultar = () => document.body.classList.add('modo-privado');
  const mostrar = () => document.body.classList.remove('modo-privado');

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') ocultar();
    else mostrar();
  });
  window.addEventListener('blur', ocultar);
  window.addEventListener('focus', mostrar);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const tecla = String(e.key).toLowerCase();
    if (e.key === 'PrintScreen' || (e.ctrlKey && ['p', 's', 'u'].includes(tecla)) || (e.metaKey && ['p', 's'].includes(tecla))) {
      e.preventDefault();
      ocultar();
      setTimeout(mostrar, 900);
    }
  });
})();
