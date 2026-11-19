# FAQ

**Question :** J'ai créé une diapositive, mais la scène reste vide.

Réponse : Il manque une image à la diapositive. Les diapositives sans image ne s'affichent pas — une
surface sombre et vide serait impossible à distinguer d'une erreur sur la page.
Ouvrez l'éditeur et sélectionnez une image sous **Image ou vidéo**
ou saisissez une adresse.

**Question :** J'ai saisi une adresse vidéo, mais la diapositive n'affiche qu'
une zone sombre.

Réponse : La plupart du temps, la vidéo n’est pas accessible sans connexion, ou le **Type** est
réglé sur **Image**, car l’adresse ne comporte pas d’extension. Ouvrez l’adresse dans
une fenêtre de navigateur privée : si elle ne fonctionne pas là-bas, les
lecteurs et lectrices ne la verront pas non plus. Un message apparaissant juste en dessous du champ indique que l’adresse
n’a pas été prise en compte — elle doit commencer par `https://`.

**Question :** J’ai saisi un libellé pour le bouton, mais
il n’apparaît pas.

Réponse : Le bouton a besoin des **deux** — un libellé et une destination. Tant que
l’un des champs est vide, il ne s’affiche pas. Pour une adresse libre,
seuls `https://…`, `mailto:…`, `tel:…` et les chemins tels que `/content/…` sont acceptés ; le
formulaire affiche un avertissement si une adresse n’est pas prise en compte.

**Question :** L’image ne s’affiche pas sur toute la largeur de la fenêtre.

Réponse : Il y a deux causes possibles. Soit l’option **Plein écran** (dans l’éditeur,
à droite sous **Mise en page**) est désactivée, soit le widget se trouve dans une colonne à côté d’autres contenus.
Placez-le sur une ligne à part, en haut de la page.

**Question :** Le texte ne se trouve pas à l’endroit où commence le reste du contenu de la page.

Réponse : La zone d’affichage s’adapte à la largeur du contenu indiquée par la page.
Si celle-ci diffère, signalez le problème en indiquant l’adresse de la page.

**Question :** À la place de l’éditeur, je vois un champ de texte « Entrées » contenant des
accolades.

Réponse : L’éditeur n’a pas pu s’intégrer dans la boîte de dialogue. Fermez
les paramètres et rouvrez-les. Le texte dans le champ correspond à la
version brute des entrées ; ne la modifiez pas manuellement — une faute de frappe
dans ce champ ferait disparaître toutes les diapositives.

**Question :** La scène ne change pas d’elle-même.

Réponse : Il existe trois causes possibles : il n’y a qu’une seule diapositive ; le paramètre **Secondes par diapositive**
(dans l’éditeur, à droite sous **Comportement**) est réglé sur `0` ; ou bien l’option « Réduire les mouvements » est activée dans le système d’exploitation.
Dans ce dernier cas, c’est voulu — il est toujours possible de faire défiler les diapositives à l’aide des flèches
et des tirets.

**Question :** Je ne vois pas de flèches sur mon téléphone.

Réponse : C’est normal. Sur les écrans étroits, on fait glisser le doigt ; les
lignes sous le texte indiquent toujours quelle diapositive est actuellement au premier plan.

**Question :** Mon image est rognée sur les bords.

Réponse : La scène recadre l’image au format 21:9 ou 4:3 en fonction de la largeur de la fenêtre. Choisissez
une image laissant un espace autour du motif, ou définissez sous **Image pour
format portrait** votre propre recadrage à la verticale.

**Question :** Puis-je créer plus de huit diapositives ?

Réponse : Non. À raison de cinq secondes par diapositive, un cycle complet dure déjà
quarante secondes avec huit diapositives — personne ne reste aussi longtemps sur une scène.
La limite de huit s’applique à l’ensemble des diapositives : une entrée de chaîne comportant cinq articles
ne permet d’ajouter que trois diapositives supplémentaires.

**Question :** Dois-je mettre à jour la scène lorsqu’un nouvel article
paraît dans les actualités ?

Réponse : Pas dans le cas d’une entrée **« Canal d’actualités »** — celle-ci affiche toujours les
articles actuels du canal selon les filtres définis. Une entrée **« Article d’actualité »**,
en revanche, reste figée sur l’article que vous avez sélectionné.

**Question :** Une diapositive de l’actualité a soudainement disparu.

Réponse : L’article a été supprimé, déplacé ou n’est pas visible pour le lecteur.
Seule cette diapositive a disparu ; les autres restent en place.

**Question :** Mon entrée de chaîne affiche moins de diapositives que ce qui est configuré.

Réponse : La plupart du temps, les filtres sont trop restrictifs. L’option **« Uniquement les articles avec image »** est
sélectionnée par défaut — un canal sans images ne renvoie donc aucun résultat. Vérifiez l’
aperçu dans l’éditeur (**Bureau**) : il affiche exactement ce qui apparaîtra sur la scène
.

**Question :** Dans la sélection des chaînes, il n’y a pas une seule chaîne, mais un
champ de texte pour saisir un identifiant.

Réponse : La liste des chaînes d’actualités n’était pas accessible. Rechargez la boîte de dialogue
. Si cela ne fonctionne pas, saisissez manuellement l’identifiant de la chaîne ; il figure
dans l’adresse de la chaîne dans le CMS.

**Question :** Pourquoi l’image d’un article d’actualité est-elle floue ou
cadrée de manière étrange sur la scène ?

Réponse : Les images d’articles sont recadrées pour le format du flux, et non pour une
scène occupant toute la hauteur de l’écran. Dans l’entrée, sous **Remplacer l’image de la scène
**, ajoutez votre propre image, au format paysage et d’au moins 1920 px de large.

**Question :** Que devient la scène lors de la traduction automatique de la
page ?

Réponse : Tous les textes rédigés par vos soins sont traduits : titre,
sous-titre, libellé du bouton et description de l’image d’une diapositive,
ainsi que le titre personnalisé et le libellé d’un article d’actualité.
Les images, les liens, les chaînes, les filtres et l’ordre restent inchangés.

**Question :** Un article d’actualité affiche, sur la page traduite, des textes différents de ceux de
la langue source — s’agit-il d’une erreur ?

Réponse : Non. Le titre et le résumé d’un article d’actualité proviennent de l’article
lui-même, et ceux-ci s’affichent dans la langue que le lecteur a sélectionnée dans l’application
. Seul ce que vous avez écrit dans l’article lui-même est traduit.
Si aucune version linguistique de l’article n’est disponible, c’est celle qui existe qui s’affiche, plutôt que
de laisser la diapositive vide.

**Question :** J’ai sélectionné « Avant le fil d’Ariane », mais rien ne change.

Réponse : Cette fonctionnalité ne s’applique que si trois conditions sont remplies : la page dispose
bien d’un fil d’Ariane, la zone d’affichage se trouve tout en haut de la page, et
aucun autre contenu ne se trouve au-dessus. Si l’une de ces conditions n’est pas remplie, la
scène sous le fil d’Ariane — un fil d’Ariane au milieu de la page serait
pire que pas de changement du tout. Dans l’éditeur, une remarque s’affiche dans ce cas
au-dessus de la scène. Elle n’apparaît pas sur la page publiée ; là,
il n’est pas possible de modifier ce paramètre.

**Question :** Auparavant, il y avait une bande blanche au-dessus de la scène. Où est-elle passée ?

Réponse : La section dans laquelle se trouve la scène conserve un espacement intérieur
au-dessus de son premier bloc. Au-dessus d’un texte, cela convient, mais au-dessus d’une scène, cela crée
une bande blanche entre le menu ou le fil d’Ariane et l’image. La scène
compense elle-même cet espacement dès qu’elle se trouve tout en haut. Si un
autre bloc se trouve au-dessus d’elle, l’espacement reste tel que défini par la page.

**Question :** J’ai sélectionné « Aucun » dans **Espacement en bas**, mais il y a
encore de l’espace sous la scène.

Réponse : « Aucun » supprime l’espacement par rapport au bloc suivant dans la même
section. Si la scène est le dernier bloc de sa section, celle-ci
se termine de toute façon avec elle. L’espace qui reste alors correspond à l’espacement interne
de la section suivante — il lui appartient et peut être modifié dans ses
paramètres de section. Si le contenu suivant se trouve dans la même section
que la scène, il s’y raccorde directement avec « Aucun ».

**Question :** Sans commandes — comment faire défiler les diapos ?

Réponse : En balayant avec le doigt, en utilisant les touches fléchées, ou automatiquement :
la durée définie par diapositive s’écoule sans changement. Pour le clavier, la
scène elle-même devient sélectionnable dès que les éléments de commande sont absents.

**Question :** Où sont passés la hauteur, la largeur totale et les secondes par diapositive ? Dans la
boîte de dialogue de Staffbase, je ne les trouve plus.

Réponse : Ils se trouvent dans l’éditeur, à droite, dans le panneau **Widget** : hauteur, largeur totale,
position et espacement en bas sous **Mise en page**, les secondes par diapositive et
les éléments de commande sous **Comportement**. Ainsi, **Annuler** les supprime avec les
entrées. Les paramètres précédemment définis restent valables jusqu’à ce que vous les
modifiiez à cet endroit.

**Question :** Dans le panneau **Widget**, il est indiqué « Comme avant ». Qu’est-ce qui s’applique ?

Réponse : Le paramètre que le bloc avait déjà. L’éditeur n’a pas pu le lire correctement à partir
de l’ancien champ et n’affiche donc aucune valeur par défaut qui
ne s’applique peut-être pas du tout. Dès que vous sélectionnez une option et que vous l’enregistrez,
votre choix s’applique.
