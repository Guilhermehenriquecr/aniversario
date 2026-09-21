# Depois que a gente vai

## Interface da carta

A capa abre a leitura e inicia a música por um gesto explícito. A mensagem se revela por frases inteiras, uma de cada vez, com transições suaves, e o botão Continuar só é liberado quando a cena termina. Tocar no fundo não avança.

O visual vinho, marfim e dourado está em `premium.css`; a capa, o progresso e o controle de tamanho de texto usam `premium.js`. O layout prioriza celular, com rolagem da mensagem separada dos controles. A flor é um SVG local. A foto do Fábio aparece na cena dele, sem corte.

A trilha toca Aliança e depois O Destino Não Quis. Há pausa, volume e redução automática da música durante o vídeo. O vídeo tem controles próprios.

Há uma dissuasão de captura: impressão, salvar página, menu de contexto e alguns atalhos são bloqueados; ao sair da aba, a mensagem é ocultada. Isso dificulta capturas casuais, mas não pode impedir gravações feitas pelo sistema operacional ou por outro dispositivo.

Verificação do fluxo: `node --test tests/experiencia.test.cjs`. Use `?teste=1` ao visualizar para preservar o contador de leituras.

Página única, sem build, sem dependência e sem banco de dados.
É só HTML, CSS e JavaScript, por isso sobe na Vercel sem configuração nenhuma.

## Pré-visualizar aqui

```powershell
node servidor.mjs
```

Depois abra <http://localhost:4173/?teste=1>

## Atalhos (só funcionam com `?teste=1`)

| Endereço | O que faz |
| --- | --- |
| `?teste=1` | Percorre tudo sem gastar nenhuma das 5 leituras |
| `?teste=1&ir=12` | Pula direto para a tela 12 (a assinatura escondida) |
| `?reiniciar=1` | Zera o contador e devolve as 5 leituras |

**Use sempre `?teste=1` enquanto estiver mexendo.** Sem ele, cada vez que você
chegar ao fim você queima uma leitura de verdade.

## Publicar na Vercel

O jeito mais rápido, sem git:

```powershell
npx vercel
```

Na primeira vez ele pede login e algumas respostas. Aceite os padrões:
framework é **Other**, não tem build, o diretório raiz é o próprio projeto.
No fim ele devolve uma URL `*.vercel.app`.

Para publicar em produção depois de conferir:

```powershell
npx vercel --prod
```

Pelo painel da Vercel é igualmente simples: suba esta pasta para um repositório
no GitHub, clique em **Add New → Project**, escolha o repositório e clique em
**Deploy**. Não preencha build command nem output directory.

## Editar

Quase tudo que importa está no topo do `app.js`:

- `CONFIG`: número de leituras, som, contador na primeira tela
- `ROTEIRO`: o texto de cada tela, na ordem
- `TEXTO_DO_SMS`: a mensagem, palavra por palavra
- `VERSOS`: os seis versos do acróstico
- `VERSO_FINAL`: a frase que sobra depois da destruição
- `MIDIA`: os caminhos da foto e do vídeo

Duas telas ficam ligadas e desligadas no `CONFIG`:

- `mostrarAssinaturaDoTexto` mostra a tela 19, onde o seu nome aparece escondido
  dentro da mensagem do SMS
- `mostrarVersos` está em `false` e liga de volta a tela dos seis versos que
  escondiam o nome dela, F-L-Á-V-I-A

O visual está em `styles.css`. As cores ficam nas variáveis do topo do arquivo.

## A foto e o vídeo

Estão em `midia/foto.jpg` (141 KB) e `midia/video.mp4` (1,5 MB, 7,3 s,
H.264 + AAC, roda no Safari do iPhone sem conversão).

A foto aparece na tela 12, como a tela da viagem a Pirenópolis, e o vídeo na
tela 20, logo antes da destruição. A foto é baixada de fundo assim que ela abre
a experiência; o vídeo só começa a baixar quando ela chega na tela 12, para não
gastar dados de quem desiste no começo.

O vídeo nunca toca sozinho: ela aperta o botão da lembrança. O avanço é feito
pelo botão Continuar; tocar no fundo não pula cenas.

Os arquivos originais do WhatsApp ficaram na pasta de propósito, mas estão
listados no `.vercelignore`. Só as cópias de `midia/` vão para o ar.

## O recorte de jornal

A tela 9 mostra a reportagem do Folia Goiás como um recorte de papel. Ele é
**tipografia de verdade**, não a imagem da reportagem.

O motivo é prático: o print é largo e baixo, cerca de 1420 por 170 pixels. Numa
tela de 390 pixels ele apareceria com 27% do tamanho, e o texto ficaria
ilegível em qualquer celular. Recriado em tipografia, ele fica nítido em
qualquer tela, mantém a diagramação de jornal e ainda acompanha o tamanho do
texto do site.

Se você ainda preferir o print de verdade, salve ele nesta pasta como
`midia/reportagem.jpg` e me avise que eu troco a tela.

### Antes de publicar

O endereço da Vercel é público: **qualquer pessoa com o link vê e baixa a foto
e o vídeo.** Já existe `robots.txt` bloqueando buscadores e a página tem
`noindex`, mas isso não impede alguém de abrir o endereço. Se isso te incomodar,
é melhor não publicar as duas telas. Basta remover `{ tipo: 'foto' }` e
`{ tipo: 'video' }` da lista `CAPITULOS` no `app.js`.

## Se você mexer no texto

Os seis versos de `VERSOS` **precisam** começar com F, L, A, V, I, A, nessa
ordem. É isso que faz o nome dela aparecer na margem. O acento de "Às vezes"
conta como A.

## Uma coisa que você precisa saber

Nesta versão o contador vive no aparelho dela (localStorage), não num servidor.
Na prática, para ela é idêntico: cinco leituras completas e a mensagem se
encerra. A diferença é que um acidente (abrir no tablet, limpar os dados do
navegador) não destrói o presente por engano.

Se você quiser o contador de verdade no servidor, dá para adicionar um Redis
na Vercel e contar as leituras por link em vez de por aparelho. É meia hora de
trabalho e a estrutura já está pronta para isso.
# Painel privado

O painel fica em `/admin.html`. Para ativar o rastreamento persistente no Vercel,
adicione `KV_REST_API_URL` e `KV_REST_API_TOKEN` de uma integração Upstash Redis.
O login padrão é `guilherme` / `bregadeira`; defina `ADMIN_USER`, `ADMIN_PASSWORD`
e `ADMIN_SECRET` nas variáveis do projeto para substituir os valores padrão.

O painel registra abertura, sessão, slide alcançado, conclusão, aparelho e
localidade aproximada fornecida pelos cabeçalhos do Vercel. O botão **Zerar
contadores** remove todos os eventos armazenados.
