# Definições

Tudo é gerido no editor, que aparece automaticamente ao abrir as definições:
as entradas à esquerda e no centro, as definições do palco
à direita no painel **Widget**. Na caixa de diálogo do Staffbase, resta apenas o campo de texto
«Entradas» atrás do editor; trata-se da versão preliminar e não é necessário alterá-la
.

| Configuração | Descrição |
| --- | --- |
| Entradas | O conteúdo do palco: slides próprios, artigos de notícias individuais e canais de notícias completos. |

### Painel «Widget», separador «Design»

| Configuração | Descrição |
| --- | --- |
| Altura | `Altura da secção` é a predefinição. Ao lado, `Pequena (320–420 px)`, `Média (420–560 px)`, `Grande (560–720 px)` e `Altura do ecrã`. |
| Largura total | Quando ativada (predefinição), a imagem ocupa toda a largura da janela, enquanto o texto permanece alinhado à margem da página. Quando desativada, o palco permanece na coluna de conteúdo. |
| Posição | `Após a trilha de navegação` é a predefinição: o palco começa abaixo da linha da trilha de navegação. `Antes da trilha de navegação` coloca-o alinhado logo abaixo do menu e desloca a trilha de navegação para baixo. Apenas se aplica se o painel estiver na parte superior da página e se a página tiver, de facto, uma barra de navegação. |
| Espaço inferior | `Padrão` é a predefinição: abaixo do painel mantém-se o espaço que a página coloca entre os seus blocos. «Nenhum» faz com que o bloco seguinte se encaixe diretamente — no caso de «À frente da trilha de navegação», diretamente abaixo da trilha de navegação. |

### Painel «Widget», separador «Comportamento»

| Configuração | Descrição |
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
| Slide | Um slide editado manualmente: imagem ou vídeo, título, subtítulo, botões. |
| Artigo de notícias | Um artigo específico como um slide. O conteúdo e o destino provêm do artigo. |
| Canal de notícias | Um canal completo, um slide por artigo. Os novos artigos aparecem sem necessidade de intervenção adicional. |

Todos os três constam na mesma lista, podem ser misturados e ordenados arrastando a
alça ou através dos botões **para cima** e **para baixo**. No total,
o palco mostra, no máximo, oito diapositivos — uma entrada de canal conta com todos os
diapositivos que contribui.

## Campos de um diapositivo

| Campo | Descrição |
| --- | --- |
| Imagem ou vídeo | Obrigatório. Da biblioteca multimédia ou através de um endereço (`https://…`). Horizontal, com pelo menos 1920 px de largura. Sem imagem ou vídeo, o slide não é apresentado. |
| Endereço | Em **Inserir endereço**, em vez da biblioteca multimédia: o endereço `https` de uma imagem ou vídeo. Outros endereços não são aceites. |
| Tipo | Imagem ou vídeo. É definido automaticamente pela extensão do endereço (`.mp4`, `.webm`, `.mov` são vídeos); selecionar manualmente apenas em endereços sem extensão. |
| Descrição da imagem ou do vídeo | O que se vê. Deixe em branco apenas no caso de imagens e vídeos puramente decorativos — os leitores de ecrã leem este campo em voz alta. |
| Formato vertical | Opcional. É apresentado em ecrãs estreitos e verticais. Se não for indicado, é utilizado o recorte horizontal em todos os casos. |
| Título | Seja breve: até cerca de 24 caracteres, permanece numa única linha. |
| Subtítulo | Opcional, uma a duas linhas. |
| Botões | Opcional, até três por diapositivo. Apresentam-se como uma lista com estilo e destino; um clique expande os campos de um botão. Subir/descer, duplicar e eliminar através dos ícones acima dos campos. Um botão só aparece se o texto e o destino estiverem preenchidos. Apenas em slides editados manualmente; os slides de notícias obtêm o seu botão a partir da publicação. |
| Destino | **Endereço** (`https://…`, `mailto:…`, `tel:…` ou um caminho como `/content/…`), **página** da Staffbase ou **artigo de notícias** da Staffbase (primeiro o canal, depois o artigo). Outros endereços, como `javascript:`, não são aceites. |
| Estilo | **Preenchido a vermelho** (ação principal, predefinição), **Preenchido a branco**, **Contorno branco** ou **Referência de texto**. Os botões a partir do segundo começam com contorno, para que não haja duas áreas vermelhas lado a lado. |
| Ícone | Opcional: seta, ângulo, ligação externa, descarregar, reproduzir, documento, calendário, e-mail, telefone ou informação. Quando se seleciona um ícone, aparece **O ícone aparece**: antes ou depois do texto. |
| Abrir num novo separador | Botão. Abre o destino do botão num novo separador. Habitual para destinos externos. |

## Campos de uma publicação de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Determina quais as publicações disponíveis para seleção. |
| Publicação | Obrigatório. As cinquenta publicações mais recentes do canal, com as mais recentes em primeiro lugar. |
| Título | Opcional. Deixe em branco para utilizar o título da publicação. |
| Mostrar texto de pré-visualização | Ativado por predefinição. O texto de pré-visualização (teaser) aparece como subtítulo e é reduzido para 240 caracteres. |
| Texto do botão | `Saiba mais` por predefinição. Deixe em branco para omitir o botão; o destino é sempre a publicação. |
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
| Hashtags | Opcional, várias separadas por vírgulas. Basta uma publicação que inclua uma delas. |
| Mostrar texto de pré-visualização | Ativado por predefinição. |
| Texto do botão | Aplica-se a todos os slides do canal. Deixe em branco para omitir o botão. |

## Notas

- **Altura** funciona como um limite, não como uma altura fixa: o palco adapta-se a ecrãs largos
  ecrãs 21:9 e em ecrãs estreitos 4:3, e é apenas fixada nos limites do
  nível selecionado.
- `Altura do ecrã` preenche a área visível, deduzindo o cabeçalho,
  mas com um mínimo de 420 px.
- **Segundos por diapositivo** só tem efeito a partir do segundo diapositivo.
- Quem tiver definido «Reduzir movimento» no sistema operativo não verá
  a mudança por si só — independentemente desta configuração.
- Na parte superior, o palco alinha-se sempre perfeitamente — com as migalhas de navegação ou, no caso de
  «Antes das migalhas de navegação», com o menu. Para tal, compensa o espaço interno que a secção mantém
  acima do seu primeiro bloco. Isto só acontece se
  não houver outro conteúdo acima do palco.
- Se o palco for o último bloco da sua secção, a secção termina
  com ele — independentemente da altura. Com um nível fixo, a secção adapta-se ao
  palco; com `Altura da secção`, o palco adapta-se à secção.
- **Espaço inferior** regula a distância em relação ao bloco seguinte na mesma
  secção. O espaçamento interno de uma secção seguinte pertence a esta e
  permanece.
- Com `altura da secção`, o palco ocupa a altura da secção apenas se
  estiver sozinho nela. Com outros blocos na mesma secção, mantém
  a sua proporção, e os blocos aproximam-se dela sem deixar espaço.
- Os elementos de controlo só aparecem a partir do segundo slide. Em ecrãs estreitos,
  as setas ficam ocultas; nesses casos, utiliza-se o gesto de deslizar.
- Uma publicação que seja eliminada ou que não esteja visível
  para o leitor leva consigo apenas o seu próprio slide. Os restantes slides permanecem no lugar.
- Os slides de notícias seguem o idioma do leitor, desde que a publicação
  esteja traduzida; caso contrário, seguem a primeira versão disponível.
- A **pré-visualização** no computador, tablet e telemóvel aplica, nas entradas de notícias,
  as mesmas regras que a página publicada. O que não constar aí,
  também não aparece na pré-visualização.
