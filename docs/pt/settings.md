# Configurações

Tudo é gerido no editor, que aparece automaticamente ao abrir as configurações:
as entradas à esquerda, no centro, em destaque, a área de trabalho da entrada selecionada,
todas as configurações à direita no painel **Configurações** — separadores
**Slide** (ou **Publicação**, **Canal**) para a entrada, **Design** e
**Comportamento** para todo o palco. Sem nenhuma entrada, o painel chama-se **Widget**. Na caixa de diálogo do Staffbase, resta apenas o campo de texto
«Entradas» atrás do editor; trata-se da versão preliminar e não precisa de ser alterada
.

| Configuração | Descrição |
| --- | --- |
| Entradas | O conteúdo do palco: slides próprios, artigos de notícias individuais e canais de notícias completos. |

### Painel «Definições», separador «Design»

| Definição | Descrição |
| --- | --- |
| Altura | `Altura da secção` é a predefinição. Ao lado, `Pequena (320–420 px)`, `Média (420–560 px)`, `Grande (560–720 px)` e `Altura do ecrã`. |
| Largura total | Quando ativada (predefinição), a imagem ocupa toda a largura da janela, enquanto o texto permanece alinhado à margem da página. Quando desativada, o palco permanece na coluna de conteúdo. |
| Posição | `Após a trilha de navegação` é a predefinição: o palco começa abaixo da linha da trilha de navegação. `Antes da trilha de navegação` coloca-o alinhado logo abaixo do menu e desloca a trilha de navegação para baixo. Apenas se aplica se o painel estiver na parte superior da página e se a página tiver, de facto, uma barra de navegação. |
| Espaço inferior | `Padrão` é a predefinição: abaixo do painel mantém-se o espaço que a página coloca entre os seus blocos. «Nenhum» faz com que o bloco seguinte se encaixe diretamente — no caso de «À frente da trilha de navegação», diretamente abaixo da trilha de navegação. |

### Painel «Definições», separador «Comportamento»

| Definição | Descrição |
| --- | --- |
| Segundos por diapositivo | `5` é o valor predefinido; são permitidos valores entre `0` e `30`; também são aceites números decimais. `0` pára o palco; depois, a navegação é feita apenas através das setas e das linhas — e, se os elementos de controlo estiverem desativados, apenas com gestos de deslizar e as setas do teclado. Em branco significa: como até agora. |
| Mostrar elementos de controlo | Quando ativado (predefinição), aparecem setas e linhas. Quando desativados, ambos desaparecem; a navegação continua com gestos de deslizar e as setas, e o tempo definido por diapositivo mantém-se inalterado. |

### Palcos existentes

Até à versão 0.4, estas definições apareciam como campos individuais na caixa de diálogo do
Staffbase. Os palcos existentes mantêm-nas: enquanto uma configuração no painel
não for alterada, o valor do campo antigo continua a aplicar-se. O painel mostra-o
onde é possível lê-lo; caso contrário, nos campos de seleção aparece **Como antes**
e nos botões a indicação «Ainda não definido aqui». Só quem
configuração e selecionar **Aplicar** é que a define no editor — e
apenas essa. Quem abrir o editor e aplicar sem alterações não altera
nada. Os campos antigos estão ocultos na caixa de diálogo.

## Tipos de entradas

| Tipo | Descrição |
| --- | --- |
| Slide | Um slide editado manualmente: imagem, vídeo ou animação, título, subtítulo, botões. |
| Artigo de notícias | Um artigo específico como um slide. O conteúdo e o destino provêm do artigo. |
| Canal de notícias | Um canal completo, um slide por artigo. Os novos artigos aparecem sem necessidade de intervenção adicional. |

Todos os três constam na mesma lista, podem ser misturados e ordenados arrastando a
alça ou através dos botões **para cima** e **para baixo**. No total,
o palco mostra, no máximo, oito slides — uma entrada de canal conta com todos os
slides que contribui.

## Campos de um slide

| Campo | Descrição |
| --- | --- |
| Estrutura | **Fixa**: título, subtítulo e botões numa posição fixa no canto inferior esquerdo. **Definida pelo utilizador**: elementos organizados em nove zonas no palco (ver abaixo). A mudança mantém o que já está presente. |
| Fundo | **Imagem ou vídeo** (um ficheiro, ver abaixo) ou **Animação**: um padrão em movimento composto por quadrados nas cores da MAN, desenhado pelo próprio widget. Uma animação adapta-se a qualquer tamanho de palco, não requer formato vertical e não carrega nada adicional. |
| Padrão | Apenas com animação. Angular: **Onda** (quadrados finos, por onde passa uma onda que os eleva), **Grelha** (grelha tranquila com uma faixa de luz que se desloca), **Módulos** (módulos distribuídos de forma aleatória que pulsam). Redondos: **Pontos** (pontos finos que criam uma ondulação), **Linhas** (linhas de cota fluidas, algumas em vermelho), **Anéis** (anéis de pontos que se espalham suavemente a partir da direita), **Corrente** (partículas que circulam e flutuam). A página de texto à esquerda — na parte inferior do telemóvel — permanece sempre livre. |
| Fundo | Apenas na animação. **Opaco**, **75 %**, **50 %**, **25 %** ou **Transparente**: por baixo, a secção por trás do palco é visível; os padrões e a letra mantêm-se nítidos. |
| Tom de fundo | Apenas com animação. **Escuro** (antracite) ou **Claro** (branco). A letra torna-se automaticamente branca ou antracite — consoante o que for mais legível no fundo visível, mesmo com um fundo translúcido sobre uma secção colorida. |
| Ritmo | Apenas na animação. **Lento** (uma passagem em 20 segundos) ou **Rápido** (12 segundos). Se a configuração «Reduzir movimento» do dispositivo estiver ativada, a animação fica parada. |
| Destaques a vermelho | Apenas na animação. Interruptor: os elementos vermelhos acompanham o movimento — aproximadamente um em cada cem no campo; no caso de linhas e anéis, linhas ou anéis inteiros. |
| Imagem ou vídeo | Obrigatório se o fundo for **imagem ou vídeo**. Da biblioteca multimédia ou através de um endereço (`https://…`). Horizontal, com pelo menos 1920 px de largura. Sem imagem ou vídeo, o slide não é apresentado. |
| Endereço | Em **Inserir endereço**, em vez da biblioteca multimédia: o endereço `https` de uma imagem ou vídeo. Outros endereços não são aceites. |
| Tipo | Imagem ou vídeo. É definido automaticamente pela extensão do endereço (`.mp4`, `.webm`, `.mov` são vídeos); selecionar manualmente apenas em endereços sem extensão. |
| Descrição da imagem ou do vídeo | O que se vê. Deixe em branco apenas no caso de imagens e vídeos puramente decorativos — os leitores de ecrã leem este campo em voz alta. |
| Formato vertical | Opcional. É apresentado em ecrãs estreitos e verticais. Se não estiver presente, é utilizado o recorte horizontal em todos os casos. |
| Título | Seja breve: até cerca de 24 caracteres, permanece numa única linha. |
| Subtítulo | Opcional, uma a duas linhas. |
| Botões | Opcional, até três por diapositivo. Apresentam-se como uma lista com estilo e destino; um clique expande os campos de um botão. Subir/descer, duplicar e eliminar através dos ícones acima dos campos. Um botão só aparece se o texto e o destino estiverem preenchidos. Apenas em slides editados manualmente; os slides de notícias obtêm o seu botão a partir da publicação. |
| Destino | **Endereço** (`https://…`, `mailto:…`, `tel:…` ou um caminho como `/content/…`), **página** da Staffbase ou **artigo de notícias** da Staffbase (primeiro o canal, depois o artigo). Outros endereços, como `javascript:`, não são aceites. |
| Estilo | **Preenchido a vermelho** (ação principal, predefinição), **Preenchido a branco**, **Contorno branco** ou **Referência de texto**. Os novos botões, a partir do segundo, começam por um contorno, para que não haja duas áreas vermelhas lado a lado. |
| Ícone | Opcional: seta, ângulo, ligação externa, descarregar, reproduzir, documento, calendário, e-mail, telefone ou informação. Com o ícone, aparece **O ícone aparece**: antes ou depois do texto. |
| Abrir num novo separador | Botão. Abre o destino do botão num novo separador. É habitual para destinos externos. |

## Campos de uma publicação de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Determina quais as publicações disponíveis para seleção. |
| Publicação | Obrigatório. As cinquenta publicações mais recentes do canal, com as mais recentes em primeiro lugar. |
| Título | Opcional. Deixe em branco para utilizar o título da publicação. |
| Mostrar texto de pré-visualização | Ativado por predefinição. O texto de pré-visualização (teaser) aparece como subtítulo e é reduzido para 240 caracteres. |
| Texto do botão | `Saiba mais` por predefinição. Deixe em branco para omitir o botão; o destino é sempre a notícia. |
| Imagem de fundo | Opcional. Recomendado se a imagem da publicação for demasiado pequena para servir de fundo. |
| Formato vertical | Opcional. É apresentado em ecrãs estreitos e verticais. |

## Campos de um canal de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Todos os slides desta entrada provêm deste canal. |
| Número de publicações | Predefinido como `3`, no máximo oito. |
| Ordem | `Mais recentes primeiro` (predefinição) ou `Mais antigas primeiro`. |
| Apenas publicações em destaque | Desativado por predefinição. Limita-se ao que está fixado nas notícias. |
| Apenas publicações com imagem | Ativado por predefinição. Sem imagem, o slide ficaria reduzido a uma área escura com texto. |
| Hashtags | Opcional, várias separadas por vírgulas. Basta uma publicação que contenha uma delas. |
| Mostrar texto de pré-visualização | Ativado por predefinição. |
| Texto do botão | Aplica-se a todos os slides do canal. Deixe em branco para omitir o botão. |

## Notas

- **Altura** funciona como um limite, não como uma altura fixa: a área de apresentação é de 21:9 em
  ecrãs largos e de 4:3 em ecrãs estreitos, sendo apenas ajustada aos limites do
  nível selecionado.
- `Altura do ecrã` preenche a área visível, excluindo o cabeçalho,
  mas com um mínimo de 420 px.
- **Segundos por diapositivo** só se aplica a partir do segundo diapositivo.
- Quem tiver definido «Reduzir movimento» no sistema operativo não verá
  a mudança por si só — independentemente desta configuração.
- Na parte superior, o palco alinha-se sempre — com as migalhas de navegação ou, no caso de
  «À frente das migalhas de navegação», com o menu. Em contrapartida, compensa o espaçamento interno que a secção mantém
  acima do seu primeiro bloco. Isto só acontece se
  não houver outro conteúdo acima do palco.
- Se o palco for o último bloco da sua secção, a secção termina
  com ele — independentemente da altura. No caso de um degrau fixo, a secção adapta-se ao
  palco; no caso de `Altura da secção`, o palco adapta-se à secção.
- **Distância inferior** controla a distância em relação ao bloco seguinte na mesma
  secção. A distância interna de uma secção seguinte pertence a essa secção e
  permanece.
- Com a opção `altura da secção`, o palco assume a altura da secção apenas se
  estiver sozinho nessa secção. Se houver outros blocos na mesma secção, mantém
  a sua proporção, e os blocos aproximam-se dele sem deixar espaço.
- Os elementos de controlo só aparecem a partir do segundo slide. Em ecrãs estreitos,
  as setas ficam ocultas; nesses casos, utiliza-se o gesto de deslizar.
- Uma publicação que seja eliminada ou que não esteja visível
  para o leitor leva consigo apenas o seu próprio slide. Os restantes slides permanecem no lugar.
- Os slides de notícias seguem o idioma do leitor, desde que a publicação
  esteja traduzida; caso contrário, seguem a primeira versão disponível.
- A **pré-visualização** no computador, tablet e telemóvel aplica, nas entradas de notícias,
  as mesmas regras que a página publicada. O que não constar aí,
  também não aparece no palco.

## Slide personalizado

Na opção **Estrutura: Definida pelo utilizador**, o palco no centro é uma área de trabalho
com nove zonas — em cima, no meio e em baixo, respetivamente à esquerda, ao centro e à direita na
linha de alinhamento. No painel à direita encontra-se o catálogo dos blocos de construção.

| Bloco | Configurações |
| --- | --- |
| Título | Texto, tamanho (**Display**, **H1**–**H3**), cor. O primeiro título do slide é o seu título principal. |
| Texto | Texto, tamanho (**L**, **M**, **S**), cor. |
| Etiqueta | Texto curto acima de um título, cor. |
| Botões | Até três botões, tal como no slide fixo. |
| Imagem ou logótipo | Da biblioteca multimédia ou por endereço, descrição, tamanho: **S** um terço, **M** dois terços, **L** toda a largura da zona — no máximo um quinto, dois quintos ou três quintos da altura do palco (em dispositivos móveis, com **L**, pouco menos de metade). Para uma imagem grande, alargue a zona (**Largura**). As imagens recortadas (PNG, SVG) ficam bem em qualquer fundo. |
| Ícone | Símbolo, tamanho, cor. |

Além disso, para cada bloco: **Zona** (uma seleção 3×3 como o palco),
**Ocultar em dispositivos móveis** e, na parte superior, **para cima**, **para baixo**, **duplicar**,
**apagar**. **Cor: Automática** segue o slide — branco ou antracite, dependendo do
que for mais legível no fundo.

**Alinhamento por zona:** Um clique no nome de uma zona (ou na sua área vazia
) mostra à direita **Horizontal na zona** (**Esquerda**, **Centro**,
**Direita**) e **Vertical na zona** (**Topo**, **Centro**, **Em baixo**). Estas
opções aplicam-se a todos os blocos da zona; os mesmos campos também se encontram nas
configurações de cada bloco. A posição predefinida é a da zona — «em baixo à esquerda»
fica em baixo à esquerda.

**Agrupar zonas:** Abaixo do alinhamento encontram-se **Largura** (**1 coluna**,
**2 colunas**, **3 colunas**) e **Altura** (**1 linha**, **2 linhas**,
**3 linhas**). Assim, por exemplo, a linha superior torna-se uma zona («em cima, toda a
largura») ou a coluna da esquerda («à esquerda, toda a altura»). A zona expande-se primeiro
para a direita ou para baixo, e na margem para a esquerda ou para cima; os blocos das
zonas sobrepostas ficam atrás dos seus próprios, mantendo-se o alinhamento. Ao
reduzir o tamanho, a zona permanece no lado em que os seus blocos se encontram. Um
tamanho que apenas abrangesse parcialmente outra zona agrupada não é
oferecido.

**Na versão móvel**, as zonas ficam dispostas uma abaixo da outra, por ordem de leitura (canto superior esquerdo,
centro superior, canto superior direito, centro esquerdo…; uma zona agrupada na posição
do seu canto superior esquerdo); o que está alinhado à direita desloca-se para a esquerda,
o que está centrado permanece centrado, os botões continuam a ser botões. O que for excessivo no telemóvel é ocultado por **Ocultar no telemóvel**;
pode verificar-se isso acima com **Telemóvel**.
