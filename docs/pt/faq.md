# Perguntas frequentes

**Pergunta:** Criei um slide, mas o palco permanece vazio.

Resposta: Falta a imagem no slide. Os slides sem imagem não são apresentados — uma
área escura e vazia não seria distinguível de um erro na página.
Abra o editor e, em **Imagem ou Vídeo**, selecione uma imagem
ou introduza um endereço.

**Pergunta:** Introduzi um endereço de vídeo, mas o slide mostra apenas
uma área escura.

Resposta: Na maioria das vezes, o vídeo não está disponível sem autenticação, ou o **Tipo** está
definido como **Imagem**, porque o endereço não tem extensão. Abra o endereço numa
janela privada do navegador: se não funcionar aí, os
leitores também não o verão. Uma mensagem logo abaixo do campo indica que o endereço
não foi aceite — tem de começar por `https://`.

**Pergunta:** Introduzi um texto para o botão, mas
este não aparece.

Resposta: O botão precisa de **ambos** — texto e destino. Enquanto
um dos campos estiver vazio, não será apresentado. No caso de um endereço livre,
só são válidos `https://…`, `mailto:…`, `tel:…` e caminhos como `/content/…`; o
formulário avisa se um endereço não for aceite.

**Pergunta:** A imagem não ocupa toda a largura da janela.

Resposta: Existem duas causas possíveis. Ou a opção **Largura total** (no editor,
à direita, em **Apresentação**) está desativada, ou o widget está numa coluna ao lado de outros conteúdos.
Coloque-o numa linha própria no topo da página.

**Pergunta:** O texto não está onde começa o resto do conteúdo da página.

Resposta: A área de trabalho adapta-se à largura do conteúdo indicada pela página.
Se houver divergências, comunique o caso indicando o endereço da página.

**Pergunta:** Em vez do editor, vejo um campo de texto «Entradas» com
chaves no seu interior.

Resposta: O editor não conseguiu integrar-se na caixa de diálogo. Feche
as definições e volte a abri-las. O texto no campo é a
versão bruta das entradas; não o edite manualmente — um erro ortográfico
nesse campo faz com que todos os slides desapareçam.

**Pergunta:** O palco não muda automaticamente.

Resposta: Três causas possíveis: existe apenas um slide; **segundos por slide**
(no editor, à direita, em **Comportamento**) está definido em `0`; ou a opção «Reduzir movimento» está ativada no sistema operativo.
Neste último caso, trata-se de um comportamento pretendido — continua a ser possível percorrer os slides através das setas
e dos traços.

**Pergunta:** Não vejo setas no telemóvel.

Resposta: É assim que deve ser. Em ecrãs estreitos, utiliza-se o gesto de deslizar; as
linhas por baixo do texto continuam a indicar qual o slide que está atualmente em destaque.

**Pergunta:** A minha imagem está cortada na margem.

Resposta: O palco recorta a imagem para 21:9 ou 4:3, dependendo da largura da janela. Escolha
uma imagem com margem à volta do motivo ou defina, em **Imagem para
formato vertical**, um recorte próprio, cortado na vertical.

**Pergunta:** Posso criar mais de oito diapositivos?

Resposta: Não. A cinco segundos por diapositivo, uma rotação completa demora, mesmo com
oito diapositivos, quarenta segundos — ninguém fica tanto tempo num palco.
O limite de oito aplica-se ao conjunto de todos os slides: uma entrada de canal com cinco publicações
só permite mais três slides adicionais.

**Pergunta:** Tenho de atualizar o palco quando surge uma nova publicação
nas notícias?

Resposta: No caso de uma entrada do **canal de notícias**, não — esta mostra sempre as
publicações atuais do canal de acordo com os filtros definidos. Por outro lado, uma entrada de **publicação de notícias**
permanece com a publicação que selecionou.

**Pergunta:** Um slide das notícias desapareceu de repente.

Resposta: A publicação foi eliminada, movida ou não está visível para o leitor.
Apenas esse slide desapareceu; os restantes permanecem.

**Pergunta:** A minha entrada do canal mostra menos slides do que os definidos.

Resposta: Na maioria das vezes, os filtros estão demasiado restritos. **Apenas publicações com imagem** é
a predefinição — um canal sem imagens não apresenta, portanto, nada. Verifique a
pré-visualização no editor (**Desktop**): mostra exatamente o que irá
aparecer no palco.

**Pergunta:** Na seleção de canais não aparece nenhum canal, mas sim um
campo de texto para um identificador.

Resposta: A lista de canais de notícias não estava acessível. Carregue novamente a janela de diálogo.
Se isso não resolver, introduza manualmente o identificador do canal; esta encontra-se
no endereço do canal no CMS.

**Pergunta:** Por que razão a imagem de uma notícia no palco está desfocada ou
tem um recorte estranho?

Resposta: As imagens das notícias são recortadas para o formato de feed, não para um
palco com a altura do ecrã. Na entrada, em **Substituir imagem do palco
**, carregue uma imagem própria, em formato horizontal e com pelo menos 1920 px de largura.

**Pergunta:** O que acontece ao palco durante a tradução automática da
página?

Resposta: São traduzidos todos os textos escritos pelo próprio utilizador: título,
subtítulo, legenda do botão e descrição da imagem de um slide,
bem como o título substituído e a legenda de uma notícia.
As imagens, os destinos dos links, os canais, os filtros e a ordem permanecem inalterados.

**Pergunta:** Uma notícia apresenta, na página traduzida, textos diferentes dos da
língua original — trata-se de um erro?

Resposta: Não. O título e o texto de resumo de uma notícia provêm da própria notícia
e são apresentados na língua que o leitor tiver definido na aplicação
. Apenas é traduzido o que escreveu na própria notícia.
Se não existir uma versão linguística da notícia, é apresentada a versão disponível, em vez de
deixar o espaço em branco.

**Pergunta:** Selecionei «Antes da trilha de navegação», mas nada muda.

Resposta: A configuração só se aplica se três condições forem cumpridas: a página tiver
de facto uma barra de navegação, a barra de navegação estiver na parte superior da página e
não houver mais nenhum conteúdo acima dela. Se alguma destas condições não for cumprida, a
palco fica por baixo da barra de navegação — uma barra de navegação no meio da página seria
pior do que nenhuma alteração. No editor, neste caso, aparece uma nota
acima do palco. Na página publicada, esta nota não aparece; aí,
não é possível alterar a configuração.

**Pergunta:** Antes, havia uma faixa branca por cima do palco. Para onde foi?

Resposta: A secção onde se encontra o palco mantém um
espaço interno acima do seu primeiro bloco. Acima de um texto, isso é correto; acima de um palco, isso
cria uma faixa branca entre o menu ou o caminho de navegação e a imagem. O palco
compensa essa distância por si próprio, assim que se encontra na parte superior. Se houver
outro bloco acima dele, a distância mantém-se tal como definida na página.

**Pergunta:** Selecionei «Nenhum» em **Distância inferior**, mas ainda há
espaço por baixo do palco.

Resposta: «Nenhum» elimina o espaçamento em relação ao bloco seguinte na mesma
secção. Se o palco for o último bloco da sua secção, a
secção termina de qualquer forma com ele. O espaço que ainda resta é o espaçamento interno
da secção seguinte — esse pertence-lhe e pode ser alterado nas suas
definições da secção. Se o conteúdo seguinte estiver na mesma secção
que o palco, este encosta diretamente a ele com a opção «Nenhum».

**Pergunta:** Sem elementos de controlo — como é que se passa de página?

Resposta: Deslizando o dedo, utilizando as setas do teclado ou automaticamente:
o tempo definido por cada diapositivo decorre sem alterações. No que diz respeito ao teclado, o
próprio palco fica selecionável assim que os elementos de controlo desaparecem.

**Pergunta:** Onde ficaram a altura, a largura total e os segundos por diapositivo? Na
caixa de diálogo do Staffbase já não os encontro.

Resposta: Encontram-se no editor, à direita, no painel **Widget**: Altura, Largura total,
Posição e Distância, na secção inferior **Design**, segundos por slide e
elementos de controlo em **Comportamento**. Assim, **Cancelar** reverte as
configurações. O que estava definido anteriormente continua válido até que o
altere nesse local.

**Pergunta:** No painel **Widget** aparece «Como antes». O que se aplica?

Resposta: A configuração que o bloco já tinha. O editor não conseguiu ler com
segurança a informação do campo antigo e, por isso, não apresenta nenhuma predefinição que
talvez nem sequer se aplique. Assim que selecionar algo nesse local e confirmar, aplica-se
a sua escolha.
