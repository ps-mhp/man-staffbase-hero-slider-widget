# Passo a passo

## Configurar o palco com uma imagem

1. Guarde primeiro a imagem na biblioteca do Staffbase. Em formato horizontal, com pelo menos
   1920 px de largura; o palco irá recortá-la para uma proporção de 21:9 ou
   4:3 — por isso, o motivo não deve ir até às bordas.
2. Coloque o widget **Hero-Slider** no topo da página, numa linha
   sem outros widgets ao lado. Se estiver numa coluna ao lado de outros
   conteúdos, não poderá ocupar toda a largura de forma adequada.
3. Abra as definições do widget. O editor abre-se
   automaticamente.
4. Clique em **Novo +** acima da lista e selecione **Slide**.
5. Em **Imagem**, clique na área tracejada **Selecionar imagem** e
   selecione a imagem da biblioteca multimédia. Sem imagem, o slide não será
   exibido.
6. Em **Descrição da imagem**, indique o que se vê. Deixe o
   campo em branco apenas se a imagem for meramente decorativa.
7. Introduza o **Título**. Este será apresentado em maiúsculas; até cerca de
   24 caracteres, permanece numa única linha.
8. Opcional: **Subtítulo** e **Botão**. O botão só aparece
   se o texto **e** o destino estiverem preenchidos.
9. Clique em **Aplicar**.
10. Defina **Segundos por diapositivo** para `0` — no caso de um único diapositivo,
    não há nada para alterar.
11. Guarde a página e verifique-a na pré-visualização, uma vez em ecrã
    largo e outra vez numa janela estreita.

## Criar vários slides

1. Abra as definições e, com isso, o editor.
2. Para cada slide adicional, selecione **Slide** em **Novo +** e
   preencha-o como indicado acima. Não é possível ter mais de oito diapositivos — ninguém percorre
   a página até lá.
3. Ordene utilizando as setas **↑** e **↓** no canto superior direito. O primeiro diapositivo
   é aquele que aparece ao carregar a página.
4. Verifique se **Segundos por slide** está definido em `5` (predefinição).
5. **Aplicar**, guardar, verificar na pré-visualização.

## Colocar uma única notícia no palco

1. Abra as definições e, com isso, o editor.
2. Clique em **Novo +** acima da lista e selecione **Notícia**.
   À esquerda, aparece uma entrada com a marca **Publicação**.
3. Em **Canal**, selecione o canal de notícias. Só depois é que poderá
   selecionar a notícia.
4. Em **Notícia**, selecione a notícia pretendida. Estão disponíveis
   as cinquenta notícias mais recentes do canal, com as mais recentes em primeiro lugar.
5. Verifique a **Pré-visualização** abaixo: mostra a imagem, o título e
   o teaser exatamente como o slide ficará mais tarde.
6. Opcional: **Substituir o título**, **Mostrar o teaser como subtítulo**
   ou alterar o **texto do botão**. O destino do
   botão é sempre a própria publicação.
7. Opcional: **substituir a imagem de fundo**. A imagem da publicação é recortada para o feed
   e nem sempre apresenta uma área de fundo adequada.
8. **Aplicar**, guardar, verificar na pré-visualização.

## Mostrar todas as publicações de um canal

1. Abra as definições e, com isso, o editor.
2. Clique em **Novo +** acima da lista e selecione **Canal de notícias**.
   À esquerda, aparece uma entrada com a etiqueta **Canal**.
3. Em **Canal**, selecione o canal de notícias.
4. Defina o **Número de diapositivos** (predefinição `3`, máximo de oito).
5. Selecione a **ordem**: `Mais recentes primeiro` ou `Mais antigos primeiro`.
6. Se necessário, defina **filtros**:
   - **Apenas publicações em destaque** — limita-se ao que está
     fixado nas notícias.
   - **Apenas publicações com imagem** — ativado por predefinição. Sem imagem,
     o slide ficaria apenas com uma área escura com texto.
   - **Palavras-chave** — separe várias com vírgulas; basta uma publicação se esta
     contiver uma delas.
7. Verifique a **Pré-visualização**: mostra exatamente as publicações que os filtros
   deixam passar. Se ficar vazia, os filtros estão demasiado restritivos.
8. **Aplicar**, guardar, verificar na pré-visualização.

A entrada conta como **uma** na lista, mas inclui vários slides.
No total, o palco nunca mostra mais de oito slides; o que exceder esse número
é omitido.

## Definir uma imagem para o formato vertical

1. Guarde na
   biblioteca multimédia um recorte do mesmo motivo, cortado na orientação vertical.
2. Selecione o slide em questão no editor.
3. Em **Imagem para formato vertical**, clique em **Selecionar imagem**.
4. **Aplicar**, guardar e verificar numa janela estreita ou no
   telemóvel.

## Alterar posteriormente

1. Abra as definições do widget; o editor abre-se com as
   entradas existentes.
2. Selecione à esquerda a entrada a alterar. O ícone acima do título indica
   de que tipo se trata: **Slide**, **Publicação** ou **Canal**.
3. Altere os campos à direita. Ao clicar em **Duplicar**, é criada uma cópia da
   entrada selecionada logo a seguir; com **Apagar**, esta desaparece. As setas,
   **Duplicar** e **Apagar** aplicam-se de igual forma aos três tipos.
4. **Aplicar** grava as alterações no widget — só depois é que
   a página fica guardada.

## Se algo não funcionar

1. **O palco permanece vazio.** Falta pelo menos uma imagem: os slides sem imagem
   não são apresentados. Abra o editor e verifique se cada entrada tem
   uma imagem — no caso das notícias, na pré-visualização.
2. **A imagem não ocupa toda a largura.** O widget encontra-se numa
   coluna ao lado de outros conteúdos? Nesse caso, coloque-o numa linha própria.
   Caso contrário, verifique se a opção **Mostrar em toda a largura** está ativada
  .
3. **O texto não está alinhado na linha de alinhamento.** Isto pode dever-se a uma
   largura de conteúdo diferente da página. Comunique o caso com o
   endereço da página — o palco adapta-se à largura que a própria página
   indica.
4. **Em vez do editor, vê um campo de texto «Entradas» com JSON.** O
   editor não conseguiu integrar-se. Atualize a janela de diálogo. Não edite
   o texto manualmente.
5. **A seleção de canais permanece em branco e aparece um campo de texto para um
   identificador.** A lista de canais de notícias não estava acessível. Recarregue a
   janela de diálogo; se isso não resolver, introduza o identificador do canal. Este
   encontra-se no endereço do canal no CMS.
6. **Falta um slide de notícias na página.** A publicação foi eliminada,
   movida ou não está visível para o leitor. Os restantes slides
   não são afetados. Verifique a entrada na pré-visualização do editor.
7. **Uma entrada de canal apresenta menos slides do que o definido.** Os filtros estão
  demasiado restritivos — na maioria das vezes **Apenas publicações com imagem** num canal sem imagens — ou
  o palco já está cheio com oito slides.
