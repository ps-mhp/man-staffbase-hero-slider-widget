# Hero-Slider

O Hero-Slider é o **palco** na parte superior de uma página: uma imagem grande que ocupa toda a
largura da janela, com um título por cima, opcionalmente uma linha de subtítulo e
um botão. O modelo a seguir é o palco em man.eu.

Quem criar vários slides terá um mecanismo de alternância: os slides
transitam uns para os outros, sendo possível percorrê-los através das setas e das linhas no canto inferior esquerdo.

Não é necessário atualizar manualmente um slide. Além dos próprios slides, a
página inicial também pode apresentar **artigos das notícias**:

- **Artigo de notícias** — um artigo específico como um slide. A imagem, o título
  e o teaser provêm do artigo, e o botão redireciona para ele.
- **Canal de notícias** — um canal completo, um slide por artigo. É possível definir quantos, em
  que ordem e de acordo com que filtros. Se surgir um novo artigo no
  canal, este aparece automaticamente no palco sem necessidade de intervenção adicional.

Os três tipos constam na mesma lista e podem ser livremente combinados e
ordenados — por exemplo, um slide próprio como destaque, seguido das três últimas
notícias de um canal.

## O que os leitores veem

- A imagem ocupa toda a largura da janela — mesmo que a própria página
  tenha uma coluna de conteúdo mais estreita.
- O palco fica **alinhado na parte superior**: se a página tiver uma barra de navegação,
  o palco fica imediatamente abaixo dela; se não tiver, fica diretamente ao lado do
  menu. A faixa branca vazia que a página normalmente mantém acima do primeiro
  conteúdo é eliminada.
- O **texto mantém-se na linha de alinhamento da página**: começa na mesma
  linha vertical que o cabeçalho, o menu e o texto abaixo da área de exibição. Não
  fica, de forma expressa, colado à margem da imagem.
- O texto encontra-se no canto inferior esquerdo, sobre um gradiente escuro que se estende de baixo para
  cima. Em ecrãs largos, é adicionado um segundo gradiente a partir da esquerda
  , para que o texto claro permaneça legível sobre um fundo claro.
- No caso de vários slides: setas à esquerda e à direita, com uma linha entre elas por cada slide.
  A linha do slide atual é vermelha.
- A transição mantém-se enquanto o rato estiver sobre o palco ou o foco estiver
  nele. No telemóvel, desliza-se o dedo; as setas ficam ocultas.
- **No telemóvel** (com largura inferior a 768 píxeis), apenas o título aparece
  na imagem, com um máximo de quatro linhas; o que exceder esse limite termina em «…».
  A linha inferior e o botão ficam em segundo plano — em vez disso, um toque
  em qualquer ponto do slide leva ao destino do botão. Para os leitores de ecrã,
  a sua legenda continua a ser o nome desse link. Se um slide não tiver um destino,
  também não pode ser tocado.
- Quem tiver a opção «Reduzir movimento» ativada no sistema operativo não vê
  nenhuma transição automática nem efeito de fade — apenas os elementos de controlo.
- Os slides das notícias têm o mesmo aspeto que qualquer outro slide. O facto de o conteúdo
  provir de uma notícia não é percetível externamente.

## O que vê no editor do CMS

O editor mostra a área de visualização dentro da coluna de conteúdo, ou seja, **mais estreita do que na
página publicada**. A extensão real da imagem e a localização do texto
só podem ser avaliadas na pré-visualização ou na página publicada
. Verifique sempre, pelo menos uma vez, com a largura da janela reduzida
— é aí que se aplica o recorte em formato vertical.
