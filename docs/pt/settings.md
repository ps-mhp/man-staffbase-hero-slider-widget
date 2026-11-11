# Definições

| Definição | Descrição |
| --- | --- |
| Entradas | O conteúdo do palco: slides próprios, notícias individuais e canais de notícias completos. É gerido através do editor, que aparece automaticamente ao abrir as definições. O campo de texto abaixo é a versão preliminar e não precisa de ser alterado. |
| Altura | `Padrão (420–560 px)` é a predefinição. Além disso, `Baixa (320–420 px)`, `Alta (560–720 px)` e `Altura do ecrã`. |
| Mostrar em toda a largura | Quando ativada (predefinição), a imagem ocupa toda a largura da janela, enquanto o texto permanece alinhado à margem da página. Quando desativada, o palco permanece na coluna de conteúdo. |
| Segundos por diapositivo | O valor predefinido é `5`. O valor `0` pára o palco; nesse caso, a navegação é feita apenas através das setas e das linhas — e, se os controlos estiverem desativados, apenas com gestos de deslizar e as teclas de seta. Máximo de 30. |
| Posição em relação à barra de navegação | `Após a barra de navegação` é a predefinição: o palco começa abaixo da linha da barra de navegação. `Antes da barra de navegação` coloca-o alinhado com o menu e desloca a barra de navegação para baixo. Apenas se aplica se a cena estiver na parte superior da página e se a página tiver, de facto, uma barra de navegação. |
| Mostrar elementos de controlo | Quando ativado (predefinição), aparecem setas e linhas. Quando desativado, ambos desaparecem; a navegação continua através de gestos de deslizar e das setas, e o tempo definido por slide decorre inalterado. |
| Espaço para baixo | `Padrão` é a predefinição: abaixo do palco mantém-se o espaço que a página coloca entre os seus blocos. `Sem espaço` faz com que o bloco seguinte se encaixe diretamente — no caso de «À frente da trilha de navegação», diretamente abaixo da trilha de navegação. |

## Tipos de entradas

| Tipo | Descrição |
| --- | --- |
| Slide | Um slide editado manualmente: imagem, título, subtítulo, botão. |
| Artigo de notícias | Um artigo específico como um slide. O conteúdo e o destino provêm do artigo. |
| Canal de notícias | Um canal completo, um slide por artigo. Os novos artigos aparecem sem necessidade de intervenção adicional. |

Todos os três constam na mesma lista, podem ser misturados e ordenados através de **↑** e
**↓**. No total, o palco exibe, no máximo, oito diapositivos — uma
entrada de canal conta com todos os diapositivos que contribui.

## Campos de um diapositivo

| Campo | Descrição |
| --- | --- |
| Imagem ou vídeo | Obrigatório. Da biblioteca multimédia ou através de um endereço (`https://…`). Horizontal, com pelo menos 1920 px de largura. Sem imagem ou vídeo, o slide não é exibido. |
| Endereço | Em vez da biblioteca multimédia: o endereço `https` de uma imagem ou vídeo. Outros endereços não são aceites. |
| Tipo | Imagem ou vídeo. É definido automaticamente pela extensão do endereço (`.mp4`, `.webm`, `.mov` são vídeos); selecionar manualmente apenas em endereços sem extensão. |
| Descrição da imagem ou do vídeo | O que se vê. Deixe em branco apenas no caso de imagens e vídeos puramente decorativos — os leitores de ecrã leem este campo em voz alta. |
| Imagem ou vídeo para formato vertical | Opcional. É apresentado em ecrãs estreitos e verticais. Se não estiver presente, é utilizada a versão horizontal em todos os casos. |
| Título | Seja breve: até cerca de 24 caracteres, permanece numa única linha. |
| Subtítulo | Opcional, uma a duas linhas. |
| Botões | Opcional, até três por diapositivo, ordenáveis com ↑/↓. Um botão só aparece se o texto e o destino estiverem preenchidos. Apenas em diapositivos editados manualmente; os diapositivos de notícias obtêm o seu botão a partir da publicação. |
| Destino | **Endereço livre** (`https://…`, `mailto:…`, `tel:…` ou um caminho como `/content/…`), **página da Staffbase** ou **artigo de notícias da Staffbase** (primeiro o canal, depois o artigo). Outros endereços, como `javascript:`, não são aceites. |
| Estilo | **Preenchido a vermelho** (ação principal, predefinição), **Preenchido a branco**, **Contorno branco** ou **Referência de texto**. Os botões a partir do segundo começam com contorno, para que não haja duas áreas vermelhas lado a lado. |
| Ícone | Opcional: seta, ângulo, ligação externa, descarregar, reproduzir, documento, calendário, e-mail, telefone ou informação — antes ou depois do texto. |
| Abrir numa nova aba | Abre o destino do botão numa nova aba. É habitual para destinos externos. |

## Campos de uma publicação de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Determina quais as publicações disponíveis para seleção. |
| Publicação | Obrigatório. As cinquenta publicações mais recentes do canal, com as mais recentes em primeiro lugar. |
| Substituir título | Opcional. Deixe em branco para utilizar o título da publicação. |
| Mostrar teaser como subtítulo | Ativado por predefinição. O teaser é reduzido para 240 caracteres. |
| Texto do botão | `Saiba mais` por predefinição. Deixe em branco para omitir o botão; o destino é sempre a notícia. |
| Substituir imagem de fundo | Opcional. Recomendado se a imagem da publicação estiver demasiado recortada para o fundo. |
| Imagem para formato vertical | Opcional. É apresentada em ecrãs estreitos e verticais. |

## Campos de um canal de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Todos os slides desta entrada provêm deste canal. |
| Número de slides | Predefinido como `3`, no máximo oito. |
| Ordem | `Mais recentes primeiro` (predefinição) ou `Mais antigas primeiro`. |
| Apenas publicações em destaque | Desativado por predefinição. Limita-se ao que está fixado nas notícias. |
| Apenas publicações com imagem | Ativado por predefinição. Sem imagem, o slide ficaria reduzido a uma área escura com texto. |
| Palavras-chave | Opcional, várias separadas por vírgulas. Basta que uma publicação contenha uma delas. |
| Mostrar teaser como subtítulo | Ativado por predefinição. |
| Texto do botão | Aplica-se a todos os slides do canal. Deixe em branco para omitir o botão. |

## Notas

- **Altura** funciona como um limite, não como uma altura fixa: a área de exibição é de 21:9 em
  ecrãs largos e de 4:3 em ecrãs estreitos, sendo apenas ajustada aos limites do
  nível selecionado.
- `Altura do ecrã` preenche a área visível, excluindo o cabeçalho,
  mas com um mínimo de 420 px.
- **Segundos por diapositivo** só se aplica a partir do segundo diapositivo.
- Quem tiver definido «Reduzir movimento» no sistema operativo não verá
  a mudança por si só — independentemente desta definição.
- Na parte superior, o palco alinha-se sempre — com as migalhas de navegação ou, no caso de
  «À frente das migalhas de navegação», com o menu. Em contrapartida, compensa o espaçamento interno que a secção mantém
  acima do seu primeiro bloco. Isto só acontece se
  não houver outro conteúdo acima do palco.
- Se o palco for o último bloco da sua secção, a secção termina
  com ele — independentemente da altura. Com um nível fixo, a secção adapta-se ao
  palco; com `Altura da secção`, o palco adapta-se à secção.
- **Espaço para baixo** regula o espaço em relação ao bloco seguinte na mesma
  secção. O espaçamento interno de uma secção seguinte pertence a esta e
  permanece.
- Com a `altura da secção`, o palco ocupa a altura da secção apenas se
  estiver sozinho nela. Com outros blocos na mesma secção, mantém
  a sua proporção, e os blocos aproximam-se dele sem espaço.
- Os elementos de controlo só aparecem a partir do segundo slide. Em ecrãs estreitos,
  as setas ficam ocultas; nesses casos, utiliza-se o gesto de deslizar.
- Uma publicação que seja eliminada ou que não esteja visível para o leitor
  leva consigo apenas o seu próprio slide. Os restantes slides permanecem no lugar.
- Os slides de notícias seguem o idioma do leitor, desde que a publicação
  esteja traduzida; caso contrário, seguem a primeira versão disponível.
- A **pré-visualização** no editor segue as mesmas regras que a
  página publicada. O que não estiver lá também não aparecerá na
  página final.
