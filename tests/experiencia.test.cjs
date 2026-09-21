const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8');

test('toques não saltam texto nem encerram uma cena que ainda revela a assinatura', () => {
  const fn = source.slice(source.indexOf('function avancar()'), source.indexOf('function destruir()'));
  const context = vm.createContext({ ocupado: false, cena: { completo: false }, next: 0, end: 0,
    proximo() { context.next++; }, destruir() { context.end++; } });
  vm.runInContext(fn, context);
  for (const state of [{ completo:false }, { completo:true, pronto:false }, { completo:true, pronto:true, tipo:'resto' }]) {
    context.cena = state;
    vm.runInContext('avancar()', context);
  }
  assert.equal(context.next, 0);
  assert.equal(context.end, 0);
  context.cena = { completo:true, pronto:true, tipo:'texto' };
  vm.runInContext('avancar()', context);
  assert.equal(context.next, 1);
  context.cena = { completo:true, pronto:true, tipo:'fim' };
  vm.runInContext('avancar()', context);
  assert.equal(context.end, 1);
});

test('o controle de voltar retorna apenas um slide e nunca avança a leitura', () => {
  const fn = source.slice(source.indexOf('function anterior()'), source.indexOf('function avancar()'));
  const context = vm.createContext({ ocupado:false, capitulo:4, dica:{classList:{remove(){}}}, cena:{el:{classList:{add(){}}}}, setTimeout(fn){fn();}, destino:null,
    montar(indice){context.destino=indice;} });
  vm.runInContext(fn, context);
  vm.runInContext('anterior()', context);
  assert.equal(context.destino, 3);
  context.capitulo=0;
  context.destino=null;
  vm.runInContext('anterior()', context);
  assert.equal(context.destino, null);
  assert.match(source, /getElementById\('voltar'\)\.addEventListener\('click', anterior\)/);
});

test('músicas tocam na ordem, pausa não reinicia, volume e redução para vídeo funcionam', () => {
  const nodes = new Map();
  function element() {
    return { style:{}, handlers:{}, classList:{toggle(){}}, volume:0, currentTime:0, plays:0, pauses:0,
      addEventListener(type, fn){this.handlers[type]=fn;}, setAttribute(){},
      play(){this.plays++; return Promise.resolve();}, pause(){this.pauses++;} };
  }
  const document = { getElementById(id){if(!nodes.has(id)) nodes.set(id,element()); return nodes.get(id);},
    createElement(){const audio=element(); nodes.set('audio',audio); return audio;}, body:{appendChild(){}} };
  const context = vm.createContext({ document, CONFIG:{som:true,volumeMusica:.42}, MIDIA:{musica:'primeira.mp3',musicaDepois:'segunda.mp3',musicaPenultima:'penultima.mp3',musicaFinal:'terceira.mp3'},
    window:{}, setInterval(fn){for(let i=0;i<80;i++) fn(); return 1;}, clearInterval(){} });
  vm.runInContext(source.slice(source.indexOf('const Trilha ='), source.indexOf('lerEstado();')),context);
  vm.runInContext('Trilha.ligar()', context);
  const audio = nodes.get('audio');
  assert.equal(audio.src,'primeira.mp3');
  assert.equal(audio.loop,false);
  audio.handlers.ended();
  assert.equal(audio.src,'segunda.mp3');
  assert.equal(audio.plays,2);
  audio.handlers.ended();
  assert.equal(audio.src,'penultima.mp3');
  assert.equal(audio.plays,3);
  audio.handlers.ended();
  assert.equal(audio.src,'terceira.mp3');
  assert.equal(audio.plays,4);
  audio.currentTime=12;
  nodes.get('som').handlers.click({stopPropagation(){}});
  assert.equal(audio.pauses,1);
  nodes.get('som').handlers.click({stopPropagation(){}});
  assert.equal(audio.currentTime,12);
  vm.runInContext('Trilha.reduzir(true)', context);
  assert.equal(audio.volume,.42*.15);
  vm.runInContext('Trilha.reduzir(false)', context);
  assert.equal(audio.volume,.42);
});

test('inserir cenas não desloca o jornal nem a foto de Pirenópolis', () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('const CONFIG'), source.indexOf('const param =')), context);
  const start = source.indexOf('const CAPITULOS');
  vm.runInContext(source.slice(start, source.indexOf('let cena =', start)), context);
  const ids = vm.runInContext('CAPITULOS.map(c => c.tipo === "texto" ? ROTEIRO[c.i].id : c.tipo)', context);
  assert.equal(ids[ids.indexOf('futuroFolia')+1], 'recorte');
  assert.equal(ids[ids.indexOf('recorte')+1], 'assinatura');
  assert.equal(ids[ids.indexOf('assinatura')+1], 'depoisCarnaval');
  assert.equal(ids[ids.indexOf('tatudobem')+1], 'foto');
  assert.equal(ids[ids.indexOf('foto')+1], 'tentativa');
});
