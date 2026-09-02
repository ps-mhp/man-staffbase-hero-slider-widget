# Definições

| Definição | Descrição |
| --- | --- |
| Entradas | O conteúdo do palco: slides próprios, notícias individuais e canais de notícias completos. É gerido através do editor, que aparece automaticamente ao abrir as definições. O campo de texto abaixo é a versão bruta e não precisa de ser alterado. |
| Altura | `Padrão (420–560 px)` é a predefinição. Além disso, `Baixa (320–420 px)`, `Alta (560–720 px)` e `Altura do ecrã`. |
| Exibir em toda a largura | Quando ativada (predefinição), a imagem ocupa toda a largura da janela, enquanto o texto permanece alinhado à margem da página. Quando desativada, o palco permanece na coluna de conteúdo. |
| Segundos por diapositivo | `5` é a predefinição. `0` pára o palco; nesse caso, a navegação é feita apenas através de setas e linhas. Máximo de 30. |

## Tipos de entradas

| Tipo | Descrição |
| --- | --- |
| Slide | Um slide editado manualmente: imagem, título, subtítulo, botão. |
| Artigo de notícias | Um artigo específico como um slide. O conteúdo e o destino provêm do artigo. |
| Canal de notícias | Um canal inteiro, um slide por artigo. As novas publicações aparecem sem necessidade de intervenção adicional. |

As três opções constam na mesma lista, podem ser misturadas e ordenadas através de **↑** e
**↓**. No total, o palco mostra, no máximo, oito slides — uma
entrada de canal conta com todos os slides que contribui.

## Campos de um slide

| Campo | Descrição |
| --- | --- |
| Imagem | Obrigatório. Horizontal, com pelo menos 1920 px de largura. Sem imagem, o slide não é apresentado. |
| Descrição da imagem | O que se vê na imagem. Deixe em branco apenas no caso de imagens puramente decorativas — os leitores de ecrã leem este campo em voz alta. |
| Imagem para formato vertical | Opcional. É apresentada em ecrãs estreitos e verticais. Se não existir, é utilizada a versão horizontal em todos os casos. |
| Título | É apresentado em maiúsculas. Até cerca de 24 caracteres, permanece numa única linha. |
| Subtítulo | Opcional, uma a duas linhas. |
| Botão | Opcional. Aparece apenas se o texto e o destino estiverem preenchidos. No máximo um por slide. |
| Abrir num novo separador | Abre o destino do botão num novo separador. É habitual para destinos externos. |

## Campos de uma publicação de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Determina quais as publicações disponíveis para seleção. |
| Publicação | Obrigatório. As cinquenta publicações mais recentes do canal, com as mais recentes em primeiro lugar. |
| Substituir título | Opcional. Deixe em branco para adotar o título da publicação. |
| Mostrar teaser como subtítulo | Ativado por predefinição. O teaser é reduzido para 240 caracteres. |
| Texto do botão | «Saiba mais» por predefinição. Deixe em branco para omitir o botão; o destino é sempre a notícia. |
| Substituir imagem de fundo | Opcional. Recomendado se a imagem da publicação estiver demasiado recortada para o fundo. |
| Imagem para formato vertical | Opcional. É apresentada em ecrãs estreitos e verticais. |

## Campos de um canal de notícias

| Campo | Descrição |
| --- | --- |
| Canal | Obrigatório. Todos os slides desta publicação provêm deste canal. |
| Número de slides | Predefinido para `3`, no máximo oito. |
| Ordem | `Mais recentes primeiro` (predefinição) ou `Mais antigos primeiro`. |
| Apenas publicações em destaque | Desativado por predefinição. Limita-se ao que está fixado nas notícias. |
| Apenas publicações com imagem | Ativado por predefinição. Sem imagem, o slide ficaria reduzido a uma área escura com texto. |
| Palavras-chave | Opcional, várias separadas por vírgulas. Basta uma publicação conter uma delas. |
| Mostrar teaser como subtítulo | Ativado por predefinição. |
| Texto do botão | Aplica-se a todos os slides do canal. Deixe em branco para omitir o botão. |

## Notas

- **Altura** funciona como um limite, não como uma altura fixa: o palco adapta-se a ecrãs largos
  ecrãs 21:9 e em ecrãs estreitos 4:3, e é apenas ajustada às margens do
  nível selecionado.
- `Altura do ecrã` preenche a área visível, deduzindo o cabeçalho,
  mas com um mínimo de 420 px.
- **Segundos por diapositivo** só se aplica a partir do segundo diapositivo.
- Quem tiver definido «Reduzir movimento» no sistema operativo não verá
  a mudança por si só — independentemente desta configuração.
- Os elementos de controlo só aparecem a partir do segundo slide. Em ecrãs estreitos,
  as setas ficam ocultas; nesses casos, utiliza-se o gesto de deslizar.
- Uma publicação que seja apagada ou que não esteja visível
  para o leitor leva consigo apenas o seu próprio slide. Os restantes slides permanecem no lugar.
- Os slides de notícias seguem o idioma do leitor, desde que a publicação
  esteja traduzida; caso contrário, seguem a primeira versão disponível.
- A **pré-visualização** no editor segue as mesmas regras que a
  página publicada. O que não estiver lá também não aparecerá na
  página.
