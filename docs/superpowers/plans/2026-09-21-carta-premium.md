# Carta cinematográfica — plano de implementação

**Goal:** Aplicar a direção aprovada de carta cinematográfica à mensagem para Flávia.
**Architecture:** Manter HTML/CSS/JavaScript sem build. O app controla leitura e mídia; premium.css define o acabamento e premium.js controla capa, progresso e preferências. As cenas continuam vindo do roteiro existente.
**Tech Stack:** HTML, CSS, JavaScript e SVG local.

- [ ] Capa: criar abertura com flor SVG, data, nome e botão que inicia música e leitura por gesto explícito.
- [ ] Leitura: barra de capítulo, progresso sem navegação antecipada, botão Continuar desabilitado até concluir a cena, opção de texto maior. Corrigir inserções por IDs para manter a foto depois de tatudobem.
- [ ] Visual: vinho #190e13, marfim #f3e8d8, ouro #c7a877; moldura editorial, texto confortável, fotografias inteiras e layouts responsivos.
- [ ] Música: exibir faixa e controle de volume, manter sequência Aliança → Maneva, tratar reprodução bloqueada e erros. Vídeo com botão próprio, controles e música reduzida durante reprodução.
- [ ] Acessibilidade: foco visível, controles de 44px ou mais, movimento reduzido, áreas seguras e leitor de tela sem anúncios por caractere.
- [ ] Verificar: node --check nos scripts; testes de fluxo (bloqueio de avanço, sequência de músicas, ordem das cenas); inspecionar capa e cena com foto em desktop e celular; documentar uso.

Não alterar mensagens pessoais nem o limite existente de cinco leituras completas. Usar ?teste=1 para todas as verificações.

## Ajustes solicitados durante a implementação

- Revelação por palavras (210 ms de base, acrescida de pausa por comprimento e pontuação), em vez de letras ou parágrafos instantâneos.
- Remover a assinatura da capa e do encerramento. O nome do autor só é revelado pelo acróstico existente.
- Remover o rótulo da trilha, mantendo nome da faixa e controles.
- Priorizar a leitura no celular: área rolável com limites próprios, sem texto sob o rodapé fixo.

## Verificação

Três testes de fluxo passaram: bloqueio de avanço, sequência/pausa/volume das músicas e ordem das inserções. Scripts verificados com node --check. Inspeção no Chrome em desktop e viewport móvel; sem erros no console nas telas inspecionadas.
