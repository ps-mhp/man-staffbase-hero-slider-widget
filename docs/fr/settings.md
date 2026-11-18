# Paramètres

Tout est géré dans l'éditeur, qui s'affiche automatiquement à l'ouverture des paramètres
: les entrées à gauche et au centre, les paramètres de la scène
à droite dans le panneau **Widget**. Dans la boîte de dialogue de Staffbase, il ne reste que le champ de texte
« Entrées » derrière l’éditeur ; il s’agit d’une ébauche qui ne doit pas être modifiée
.

| Paramètre | Description |
| --- | --- |
| Entrées | Le contenu de la scène : vos propres diapositives, des articles d’actualité individuels et des chaînes d’actualité complètes. |

### Panneau « Widget », onglet « Mise en page »

| Paramètre | Description |
| --- | --- |
| Hauteur | `Hauteur de la section` est sélectionnée par défaut. À côté : `Petit (320–420 px)`, `Moyen (420–560 px)`, `Grand (560–720 px)` et `Hauteur de l'écran`. |
| Pleine largeur | Lorsque cette option est activée (par défaut), l’image s’étend sur toute la largeur de la fenêtre, tandis que le texte reste aligné sur la ligne de flottaison de la page. Lorsqu’elle est désactivée, la scène reste dans la colonne de contenu. |
| Position | `Après le fil d’Ariane` est la valeur par défaut : la scène commence sous la ligne du fil d’Ariane. `Avant le fil d’Ariane` la place au ras du menu et déplace le fil d’Ariane en dessous. Ne s'applique que si la scène se trouve en haut de la page et si celle-ci comporte un fil d'Ariane. |
| Espace en bas | `Par défaut` est sélectionné par défaut : l'espace laissé par la page entre ses blocs est conservé sous la scène. « Aucun » permet au bloc suivant de s’aligner directement — dans le cas de « Devant le fil d’Ariane », directement sous le fil d’Ariane. |

### Panneau « Widget », onglet « Comportement »

| Paramètre | Description |
| --- | --- |
| Secondes par diapositive | `5` est la valeur par défaut, les valeurs autorisées vont de `0` à `30` ; les nombres décimaux sont également acceptés. `0` met la scène en pause ; le défilement ne s’effectue alors qu’à l’aide des flèches et des traits — et si les commandes sont désactivées, uniquement par glissement et à l’aide des touches fléchées. Laisser vide signifie : comme auparavant. |
| Afficher les commandes | Activé (réglage par défaut) : les flèches et les traits apparaissent. Lorsqu’ils sont désactivés, les deux disparaissent ; le défilement se poursuit par glissement et à l’aide des touches fléchées, et la durée définie par diapositive reste inchangée. |

### Scènes existantes

Jusqu’à la version 0.4, ces paramètres figuraient sous forme de champs individuels dans la boîte de dialogue de
Staffbase. Les scènes existantes les conservent : tant qu’un paramètre du panneau
n’a pas été modifié, la valeur de l’ancien champ reste valable. Le panneau l’affiche
là où elle est lisible ; sinon, la mention **Comme auparavant** apparaît dans les champs de sélection
et la remarque « Pas encore défini ici » s’affiche sur les boutons. Ce n’est qu’après avoir modifié un
modifie un paramètre et clique sur **Appliquer** ne le définit dans l’éditeur — et
uniquement celui-ci. Si vous ouvrez l’éditeur et appliquez les modifications sans rien changer, vous ne modifiez
rien. Les anciens champs sont masqués dans la boîte de dialogue.

## Types d’entrées

| Type | Description |
| --- | --- |
| Diapositive | Une diapositive gérée manuellement : image ou vidéo, titre, sous-titre, boutons. |
| Article d’actualité | Un article spécifique sous forme de diapositive. Le contenu et la destination proviennent de l’article. |
| Chaîne d’actualités | Une chaîne entière, une diapositive par article. Les nouveaux articles s’affichent automatiquement. |

Ces trois types d’entrées figurent dans la même liste ; elles peuvent être mélangées et triées en faisant glisser la
poignée ou à l’aide des boutons **vers le haut** et **vers le bas**. Au total,
la scène affiche au maximum huit diapositives — une entrée de chaîne compte alors avec toutes les
diapositives qu’elle apporte.

## Champs d’une diapositive

| Champ | Description |
| --- | --- |
| Image ou vidéo | Obligatoire. Issue de la médiathèque ou via une adresse (`https://…`). Horizontale, d’au moins 1920 px de large. Sans image ni vidéo, la diapositive n’est pas affichée. |
| Adresse | Derrière **Insérer une adresse**, à la place de la médiathèque : l’adresse `https` d’une image ou d’une vidéo. Les autres adresses ne sont pas prises en compte. |
| Type | Image ou vidéo. Se définit automatiquement en fonction de l’extension de l’adresse (`.mp4`, `.webm`, `.mov` sont des vidéos) ; à sélectionner manuellement uniquement pour les adresses sans extension. |
| Description de l’image ou de la vidéo | Ce qui est visible. Ne laisser ce champ vide que pour les images et vidéos purement décoratives — les lecteurs d’écran lisent ce champ à voix haute. |
| Format portrait | Facultatif. Affiché sur les écrans étroits et verticaux. S’il manque, le format paysage est utilisé partout. |
| Titre | Restez concis : jusqu’à environ 24 caractères, il tient sur une seule ligne. |
| Sous-titre | Facultatif, une à deux lignes. |
| Boutons | Facultatif, jusqu’à trois par diapositive. Affichés sous forme de liste avec style et destination ; un clic déplie les champs d’un bouton. Déplacement vers le haut/bas, duplication et suppression via les icônes situées au-dessus des champs. Un bouton n’apparaît que si le libellé et la destination sont renseignés. Uniquement pour les diapositives gérées manuellement ; les diapositives d’actualités récupèrent leur bouton depuis l’article. |
| Destination | **Adresse** (`https://…`, `mailto:…`, `tel:…` ou un chemin d’accès tel que `/content/…`), **page** de Staffbase ou **article d’actualité** de Staffbase (d’abord la chaîne, puis l’article). Les autres adresses, telles que `javascript:`, ne sont pas prises en compte. |
| Style | **Rempli de rouge** (action principale, par défaut), **Rempli de blanc**, **Contour blanc** ou **Lien texte**. À partir du deuxième, les nouveaux boutons s’affichent en contour afin d’éviter que deux zones rouges ne se trouvent côte à côte. |
| Icône | Facultatif : flèche, angle, lien externe, téléchargement, lecture, document, calendrier, e-mail, téléphone ou information. Si une icône est sélectionnée, **« Icône »** apparaît : avant ou après le texte. |
| Ouvrir dans un nouvel onglet | Bouton. Ouvre la destination du bouton dans un nouvel onglet. Couramment utilisé pour les destinations externes. |

## Champs d’un article d’actualité

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Détermine les articles disponibles. |
| Article | Obligatoire. Les cinquante articles les plus récents de la chaîne, les plus récents en premier. |
| Titre | Facultatif. Laisser vide pour reprendre le titre de l'article. |
| Afficher le texte d'aperçu | Activé par défaut. Le texte d'aperçu (teaser) apparaît en sous-titre et est raccourci à 240 caractères. |
| Libellé du bouton | « En savoir plus » par défaut. Laisser vide pour ne pas afficher le bouton ; la destination est toujours l’article. |
| Image de fond | Facultatif. Utile si l’image de l’article est trop recadrée pour servir d’image de fond. |
| Format portrait | Facultatif. Affiché sur les écrans étroits et verticaux. |

## Champs d’un fil d’actualité

| Champ | Description |
| --- | --- |
| Fil | Obligatoire. Toutes les diapositives de cette entrée proviennent de ce fil. |
| Nombre d’articles | `3` par défaut, huit au maximum. |
| Ordre | « Les plus récents en premier » (par défaut) ou « Les plus anciens en premier ». |
| Uniquement les publications mises en avant | Désactivé par défaut. Limité aux publications épinglées dans l’actualité. |
| Uniquement les publications avec image | Activé par défaut. Sans image, la diapositive ne serait qu’une surface sombre avec du texte. |
| Hashtags | Facultatif, plusieurs séparés par des virgules. Une seule publication suffit si elle en comporte un. |
| Afficher l’aperçu | Activé par défaut. |
| Libellé du bouton | S'applique à toutes les diapositives de la chaîne. Laisser vide pour ne pas afficher le bouton. |

## Remarques

- **Hauteur** sert de limite, et non de hauteur fixe : la scène s'adapte aux
  et sur les écrans étroits 4:3, et n’est verrouillée qu’aux limites du
  niveau sélectionné.
- `Hauteur de l’écran` remplit la partie visible de l’écran, hors en-tête,
  avec un minimum de 420 px.
- **Secondes par diapositive** ne s’applique qu’à partir de la deuxième diapositive.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne verront pas
  le changement s’effectuer automatiquement — quel que soit ce paramètre.
- En haut, la scène s’aligne toujours parfaitement — avec le fil d’Ariane ou, si
  « Devant le fil d’Ariane » est activé, avec le menu. Elle compense pour cela l’espacement intérieur que la section maintient
  au-dessus de son premier bloc. Cela ne se produit que s’il
  n’y a pas d’autre contenu au-dessus de la scène.
- Si la scène est le dernier bloc de sa section, la section se termine
  avec elle — quelle que soit sa hauteur. Avec un niveau fixe, la section s’adapte à la
  scène ; avec `Hauteur de section`, c’est la scène qui s’adapte à la section.
- **Espacement inférieur** règle la distance par rapport au bloc suivant dans la même
  section. L’espacement intérieur d’une section suivante appartient à celle-ci et
  est conservé.
- Avec `Hauteur de section`, la scène n’occupe la hauteur de la section que si
  elle s’y trouve seule. S’il y a d’autres blocs dans la même section, elle conserve
  son rapport hauteur/largeur, et les blocs s’approchent d’elle sans espace.
- Les commandes n’apparaissent qu’à partir de la deuxième diapositive. Sur les écrans étroits,
  les flèches sont masquées ; dans ce cas, on utilise le balayage.
- Un article supprimé ou non visible pour le lecteur
  n’emporte avec lui que sa propre diapositive. Les autres diapositives restent en place.
- Les diapositives d’actualités s’adaptent à la langue du lecteur, dans la mesure où l’article
  est traduit ; sinon, elles s’adaptent à la première version disponible.
- L'**aperçu** sur ordinateur, tablette et mobile applique, pour les articles d'actualité,
  les mêmes règles que la page publiée. Ce qui n'y figure pas
  n'apparaît pas non plus sur la scène.
