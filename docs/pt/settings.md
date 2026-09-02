# Configurações

| Cenário | Descrição |
| --- | --- |
| Entradas | O conteúdo do palco: slides próprios, artigos individuais de notícias e canais inteiros de notícias. Mantido via editor, que se mostra quando as configurações são abertas. O campo de texto abaixo é a versão aproximada e não precisa ser tocado. |
| Altura | 'Padrão (420-560 px)' está predefinido. Ao lado dele 'Baixo (320-420 px)', 'Alto (560-720 px)' e 'Alto da Tela'. |
| Mostrar Largura Total | Quando ativada (padrão), a imagem percorre toda a largura da janela, enquanto o texto permanece na linha que desaparece da página. Quando desligada, a Fase permanece na coluna de conteúdo. |
| segundos por slide | '5' é o padrão. '0' para a fase; então apenas setas e traços são rolados. Máximo 30. |

## Tipos de inscrições

| Variedade | Descrição |
| --- | --- |
| Slide | Um slide mantido manualmente: imagem, manchete, sublinha, botão. |
| Post de notícias | Um post específico como slide. Conteúdo e objetivo vêm do post. |
| Canal de Notícias | Um canal inteiro, um slide por postagem. Novas publicações aparecem sem nenhuma ação adicional. |

Os três estão na mesma lista, podem ser misturados e combinados via **↑** e
**↓** . No total, o palco apresenta no máximo oito slides — um
A entrada do canal conta com todos os slides que ele contribui. 

## Campos de um escorregador

| Campo | Descrição |
| --- | --- |
| Imagem | Obrigatório. Paisagem, pelo menos 1920 px de largura. Sem foto, o slide não será exibido. |
| Descrição da imagem | O que pode ser visto na imagem. Deixe em branco apenas para imagens puramente decorativas — leitores de tela leem este campo. |
| Imagem para formato retrato | Opcional. Mostrada em telas estreitas e fixas. Se faltar, o corte da paisagem é usado em todos os lugares. |
| Cabeçalho | Está escrito em letras maiúsculas. Com cerca de 24 caracteres, permanece com espaçamento simples. |
| Sublinha | Opcional, uma ou duas linhas. |
| Botão | Opcional. Aparece apenas se a legenda e o destino estiverem preenchidos. No máximo um por slide. |
| Abrir em Nova Aba | Abre o destino do botão em uma nova aba. Comum para alvos externos. |

## Campos de um artigo de notícia

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Determina quais postagens estão disponíveis para escolha. |
| Post | Dever. Os cinquenta posts mais recentes do canal, os mais recentes primeiros. |
| Sobrescrever Título | Opcional. Deixe em branco para assumir o título do post. |
| Mostrar teaser como sublinha | Ativado por padrão. O teaser será reduzido para 240 caracteres. |
| Rótulo do botão | 'Saiba mais' por padrão. Deixe em branco para omitir o botão; o objetivo é sempre o post. |
| Sobrescrever Design de Palco | Opcional. Útil se a imagem em destaque estiver cortada muito apertada para o palco. |
| Imagem Retrato | Opcional. Mostrado em telas estreitas e fixas. |

## Campos de um canal de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Todos os slides desta entrada são deste canal. |
| Número de slides | '3' padrão, máximo oito. |
| Ordem | 'Mais novo primeiro' (padrão) ou 'Mais antigo primeiro'. |
| Apenas postagens em destaque | Desligado por padrão. Limitado ao que está fixado nas notícias. |
| Apenas postagens com imagem | Ativado por padrão. Sem uma imagem, tudo o que restaria do slide seria uma área escura com texto. |
| Tags | Opcionais, vários separados por vírgula. Um poste é suficiente se tiver um deles. |
| Mostrar teaser como sublinha | Ativado por padrão. |
| Rótulo do botão | Aplica-se a todos os slides no canal. Deixe em branco para omitir o botão. |

## Notas

- **Altura** atua como um limite, não como uma altura fixa: o palco é amplo
  telas 21:9 e no estreito 4:3 e é usado apenas nos limites do
  passo selecionado. 
- 'Screen-up' preenche a página visível menos o cabeçalho, 
  Mas pelo menos 420 px. 
- **Segundos por slide** só têm efeito a partir do segundo slide. 
- Se você definiu "Reduzir Movimento" no sistema operacional, não verá nenhuma
  Mudança sozinha — independentemente dessa configuração. 
- Os controles só aparecem a partir do segundo slide. No estreito
  as telas, as flechas estão escondidas; há deslizar. 
- Uma postagem que foi deletada ou não visível para quem está lendo
  leva apenas seu próprio contraponto consigo. Os outros foils permanecem no lugar. 
- Slides de notícias seguem a linguagem da pessoa que lê, desde que o artigo seja usado
  é traduzido; fora isso, a primeira versão disponível. 
- A **prévia** no editor calcula com as mesmas regras que o
  página publicada. O que não está lá também aparece no palco
  não.