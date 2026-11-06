# Hero-Slider

Le Hero-Slider est la **scène** située en haut d'une page : une grande image occupant
toute la largeur de la fenêtre, surmontée d'un titre, éventuellement d'un sous-titre et
d'un bouton. Il s'inspire de la scène du site man.eu.

Si vous créez plusieurs diapositives, vous obtenez un diaporama : les diapositives s’affichent
les unes après les autres, et on peut les faire défiler à l’aide des flèches et des traits situés en bas à gauche.

Il n’est pas nécessaire de mettre à jour une diapositive manuellement. Outre vos propres diapositives, la
page d’accueil peut également afficher des **articles issus de l’actualité** :

- **Article d’actualité** — un article spécifique sous forme de diapositive. L’image, le titre
  et le teaser proviennent de l’article, le bouton renvoie vers celui-ci.
- **Chaîne d'actualités** — une chaîne entière, une diapositive par article. Le nombre, l’
  ordre et les filtres sont paramétrables. Lorsqu’un nouvel article paraît dans la
  chaîne, il s’affiche automatiquement sur la scène.

Ces trois types figurent dans la même liste et peuvent être librement combinés et
triés — par exemple, une diapositive personnalisée en tête, suivie des trois derniers
articles d’une rubrique.

## Ce que voient les lectrices et lecteurs

- L’image s’étend sur toute la largeur de la fenêtre — même si la page
  elle-même dispose d’une colonne de contenu plus étroite.
- La scène est **alignée en haut** : si la page comporte un fil d’Ariane,
  la scène se trouve juste en dessous ; si elle n’en a pas, elle se raccorde directement au
  menu. La bande blanche vide que la page laisse habituellement au-dessus du premier
  contenu est supprimée.
- Le **texte reste aligné sur la ligne de repère de la page** : il commence sur la même
  ligne verticale que l’en-tête, le menu et le texte situé sous la zone d’affichage. Il
  n’est expressément pas aligné sur le bord de l’image.
- Le texte se trouve en bas à gauche, sur un dégradé sombre qui s'estompe de bas en
  haut. Sur les écrans larges, un deuxième dégradé s'ajoute depuis la gauche
  afin que le texte clair reste lisible sur un fond clair.
- En cas de plusieurs diapositives : des flèches à gauche et à droite, avec un trait entre chacune d’elles pour chaque diapositive.
  Le trait de la diapositive actuelle est rouge.
- Le changement se poursuit tant que la souris survole la scène ou que le focus se trouve
  sur celle-ci. Sur le téléphone, on fait glisser le doigt ; les flèches y sont masquées.
- **Sur le téléphone** (largeur inférieure à 768 pixels), seul le titre apparaît
  sur l’image, sur quatre lignes au maximum ; tout ce qui dépasse cette limite se termine par « … ».
  La sous-ligne et le bouton sont masqués — à la place, un tapotement
  n’importe où sur la diapositive mène à la destination du bouton. Pour les lecteurs d’écran,
  leur libellé correspond au nom de ce lien. Si une diapositive n’a pas de destination, elle
  ne peut pas non plus être sélectionnée.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne voient pas
  les changements s’afficher automatiquement ni de fondu — seuls les éléments de commande sont visibles.
- Les diapositives issues de la rubrique « Actualités » se présentent comme n’importe quelle autre diapositive. Le fait que le contenu provienne
  d’un article n’est pas identifiable de l’extérieur.

## Ce que vous voyez dans l’éditeur CMS

L’éditeur affiche la scène à l’intérieur de la colonne de contenu, c’est-à-dire **plus étroite que sur
la page publiée**. L’étendue réelle de l’image et l’emplacement du texte
ne peuvent être évalués que dans l’aperçu ou sur la page publiée
. Vérifiez-le toujours au moins une fois avec une
fenêtre étroite — c’est là que le recadrage en mode portrait s’applique.
