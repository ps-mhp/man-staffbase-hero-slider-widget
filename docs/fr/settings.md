# Paramètres

Tout est géré dans l'éditeur, qui s'affiche automatiquement à l'ouverture des paramètres
: les entrées à gauche, au centre la scène de l'entrée sélectionnée
en grand, tous les paramètres à droite dans le panneau **Paramètres** — onglet
**Diapositive** (ou **Contribution**, **Chaîne**) pour l’entrée, **Mise en page** et
**Comportement** pour l’ensemble de la scène. En l’absence d’entrée, ce panneau s’intitule **Widget**. Dans la boîte de dialogue de Staffbase, seul le champ de texte
« Entrées » derrière l’éditeur ; il s’agit de la version brute et il n’est pas nécessaire de la modifier
.

| Paramètre | Description |
| --- | --- |
| Entrées | Le contenu de la scène : vos propres diapositives, des articles d’actualité individuels et des chaînes d’actualité complètes. |

### Panneau « Paramètres », onglet « Mise en page »

| Paramètre | Description |
| --- | --- |
| Hauteur | `Hauteur de section` est sélectionné par défaut. À côté : `Petit (320–420 px)`, `Moyen (420–560 px)`, `Grand (560–720 px)` et `Hauteur de l'écran`. |
| Pleine largeur | Lorsque cette option est activée (par défaut), l’image s’étend sur toute la largeur de la fenêtre, tandis que le texte reste aligné sur la ligne de guidage de la page. Lorsqu’elle est désactivée, la scène reste dans la colonne de contenu. |
| Position | `Après le fil d’Ariane` est la valeur par défaut : la scène commence sous la ligne du fil d’Ariane. `Avant le fil d’Ariane` la place au ras du menu et déplace le fil d’Ariane en dessous. Ne s’applique que si la scène se trouve en haut de la page et si la page comporte un fil d’Ariane. |
| Espace en bas | `Par défaut` est sélectionné par défaut : l’espace laissé par la page entre ses blocs est conservé sous la scène. « Aucun » permet au bloc suivant de s’aligner directement — dans le cas de « Avant le fil d’Ariane », directement sous le fil d’Ariane. |

### Panneau « Paramètres », onglet « Comportement »

| Paramètre | Description |
| --- | --- |
| Secondes par diapositive | `5` est la valeur par défaut, les valeurs autorisées vont de `0` à `30` ; les nombres décimaux sont également acceptés. `0` met la scène en pause ; le défilement ne se fait alors qu’à l’aide des flèches et des traits — et si les commandes sont désactivées, uniquement par glissement et à l’aide des touches fléchées. Laisser vide signifie : comme auparavant. |
| Afficher les commandes | Activé (réglage par défaut) : les flèches et les traits apparaissent. Lorsqu’ils sont désactivés, les deux disparaissent ; le défilement se poursuit par glissement et à l’aide des touches fléchées, et la durée définie par diapositive reste inchangée. |

### Scènes existantes

Jusqu’à la version 0.4, ces paramètres figuraient sous forme de champs individuels dans la boîte de dialogue de
Staffbase. Les scènes existantes les conservent : tant qu’un paramètre du panneau
n’a pas été modifié, la valeur de l’ancien champ reste valable. Le panneau l’affiche
là où elle est lisible ; sinon, la mention **Comme auparavant** apparaît dans les champs de sélection
et la remarque « Pas encore défini ici » s’affiche sur les boutons. Ce n’est qu’après avoir modifié un
modifie un paramètre et sélectionne **Appliquer** ne le définit dans l’éditeur — et
uniquement celui-ci. Si l’on ouvre l’éditeur et que l’on applique les modifications sans rien changer,
rien n’est modifié. Les anciens champs sont masqués dans la boîte de dialogue.

## Types d’entrées

| Type | Description |
| --- | --- |
| Diapositive | Une diapositive gérée manuellement : image, vidéo ou animation, titre, sous-titre, boutons. |
| Article d’actualité | Un article spécifique sous forme de diapositive. Le contenu et la destination proviennent de l’article. |
| Chaîne d’actualités | Une chaîne entière, une diapositive par article. Les nouveaux articles s’affichent automatiquement. |

Ces trois types d’entrées figurent dans la même liste ; elles peuvent être mélangées et triées en faisant glisser la
poignée ou à l’aide des boutons **vers le haut** et **vers le bas**. Au total,
la scène affiche au maximum huit diapositives — une entrée de chaîne compte alors avec toutes les
diapositives qu’elle apporte.

## Champs d’une diapositive

| Champ | Description |
| --- | --- |
| Structure | **Fixe** : titre, sous-titre et boutons à un emplacement fixe en bas à gauche. **Personnalisée** : éléments répartis dans neuf zones, disposés sur la scène (voir ci-dessous). Le changement conserve ce qui s’y trouve. |
| Arrière-plan | **Image ou vidéo** (un fichier, voir ci-dessous) ou **animation** : un motif animé composé de carrés aux couleurs de MAN, dessiné par le widget lui-même. Une animation s’adapte à toutes les tailles de scène, ne nécessite pas de format portrait et ne charge aucun élément supplémentaire. |
| Motif | Uniquement en cas d’animation. Angulaire : **Vague** (petits carrés traversés par une vague qui les fait onduler), **Grille** (grille immobile avec une bande lumineuse mobile), **Modules** (modules répartis de manière aléatoire qui pulsent). Ronds : **Points** (petits points soulevés par une ondulation), **Lignes** (courbes de niveau fluides, certaines en rouge), **anneaux** (anneaux de points se propageant doucement depuis la droite), **courant** (particules tournoyant et dérivant). La partie texte à gauche — en bas sur le téléphone — reste toujours libre. |
| Fond | Uniquement en animation. **Opaque**, **75 %**, **50 %**, **25 %** ou **Transparent** : la section située derrière transparaît ; les motifs et le texte restent bien visibles. |
| Couleur de fond | Uniquement pour l’animation. **Foncé** (anthracite) ou **Clair** (blanc). Le texte devient automatiquement blanc ou anthracite — selon ce qui est le plus lisible sur l’arrière-plan visible, même lorsque le fond est translucide au-dessus d’une section colorée. |
| Vitesse | Uniquement pour l’animation. **Lente** (un cycle en 20 secondes) ou **Rapide** (12 secondes). Lorsque le paramètre « Réduire les mouvements » de l’appareil est activé, l’animation s’arrête. |
| Accents rouges | Uniquement pour l’animation. Commutateur : les éléments rouges défilent — environ un sur cent dans le champ ; pour les lignes et les anneaux, il s’agit respectivement de lignes ou d’anneaux entiers. |
| Image ou vidéo | Obligatoire si l’arrière-plan est une **image ou une vidéo**. Provenant de la médiathèque ou via une adresse (`https://…`). Paysage, largeur minimale de 1920 px. Sans image ni vidéo, la diapositive n’est pas affichée. |
| Adresse | Derrière **Insérer une adresse**, à la place de la médiathèque : l’adresse `https` d’une image ou d’une vidéo. Les autres adresses ne sont pas prises en compte. |
| Type | Image ou vidéo. Se définit automatiquement en fonction de l’extension de l’adresse (`.mp4`, `.webm`, `.mov` sont des vidéos) ; à sélectionner manuellement uniquement pour les adresses sans extension. |
| Description de l’image ou de la vidéo | Ce qui est visible. Ne laisser ce champ vide que pour les images et vidéos purement décoratives — les lecteurs d’écran lisent ce champ à voix haute. |
| Format portrait | Facultatif. S’affiche sur les écrans étroits et verticaux. En l’absence de cette option, le recadrage en format paysage est utilisé partout. |
| Titre | À rester concis : jusqu’à environ 24 caractères, il tient sur une seule ligne. |
| Sous-titre | Facultatif, une à deux lignes. |
| Boutons | Facultatif, jusqu’à trois par diapositive. Affichés sous forme de liste avec style et destination ; un clic déplie les champs d’un bouton. Déplacement vers le haut/bas, duplication et suppression via les icônes situées au-dessus des champs. Un bouton n’apparaît que si le libellé et la destination sont renseignés. Uniquement pour les diapositives gérées manuellement ; les diapositives d’actualités récupèrent leur bouton depuis l’article. |
| Destination | **Adresse** (`https://…`, `mailto:…`, `tel:…` ou un chemin tel que `/content/…`), **page** de Staffbase ou **article d’actualité** de Staffbase (d’abord la chaîne, puis l’article). Les autres adresses, telles que `javascript:`, ne sont pas prises en compte. |
| Style | **Rempli en rouge** (action principale, par défaut), **Rempli en blanc**, **Contour blanc** ou **Lien texte**. À partir du deuxième bouton, les nouveaux boutons s’affichent en contour afin d’éviter que deux zones rouges ne se côtoient. |
| Icône | Facultatif : flèche, angle, lien externe, téléchargement, lecture, document, calendrier, e-mail, téléphone ou information. Avec l’icône, la mention **Icône** apparaît : avant ou après le texte. |
| Ouvrir dans un nouvel onglet | Bouton. Ouvre la destination du bouton dans un nouvel onglet. Couramment utilisé pour les destinations externes. |

## Champs d’un article d’actualité

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Détermine les articles disponibles à la sélection. |
| Article | Obligatoire. Les cinquante articles les plus récents de la chaîne, les plus récents en premier. |
| Titre | Facultatif. Laisser vide pour reprendre le titre de l'article. |
| Afficher le texte d'aperçu | Activé par défaut. Le texte d'aperçu (teaser) apparaît en sous-titre et est limité à 240 caractères. |
| Libellé du bouton | « En savoir plus » par défaut. Laisser vide pour ne pas afficher le bouton ; la destination est toujours l'article. |
| Image de fond | Facultatif. Utile si l’image de l’article est trop recadrée pour servir d’image de fond. |
| Format portrait | Facultatif. Affiché sur les écrans étroits en mode portrait. |

## Champs d’une rubrique d’actualités

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Toutes les diapositives de cette entrée proviennent de cette chaîne. |
| Nombre d’articles | `3` par défaut, huit au maximum. |
| Ordre | `Les plus récents en premier` (par défaut) ou `Les plus anciens en premier`. |
| Uniquement les publications mises en avant | Désactivé par défaut. Limité aux publications épinglées dans l’actualité. |
| Uniquement les publications avec image | Activé par défaut. Sans image, la diapositive ne serait qu’une surface sombre avec du texte. |
| Hashtags | Facultatif, plusieurs séparés par des virgules. Un message suffit s’il en comporte un. |
| Afficher l’extrait | Activé par défaut. |
| Libellé du bouton | S’applique à toutes les diapositives de la chaîne. Laisser vide pour ne pas afficher le bouton. |

## Remarques

- **Hauteur** sert de limite, et non de hauteur fixe : la scène est au format 21:9 sur les
  écrans larges et au format 4:3 sur les écrans étroits, et n’est ajustée qu’aux limites du
  niveau sélectionné.
- `Hauteur de l'écran` remplit la partie visible de l'écran, hors en-tête,
  avec un minimum de 420 px.
- **Secondes par diapositive** ne s'applique qu'à partir de la deuxième diapositive.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne verront pas
  le changement s’afficher automatiquement — quel que soit ce paramètre.
- En haut, la scène s’aligne toujours parfaitement — avec le fil d’Ariane ou, si
  l’option « Avant le fil d’Ariane » est activée, avec le menu. En contrepartie, elle compense l’espacement intérieur que la section
  maintient au-dessus de son premier bloc. Cela ne se produit que s’il
  n’y a pas d’autre contenu au-dessus de la scène.
- Si la scène est le dernier bloc de sa section, celle-ci se termine
  avec elle — quelle que soit sa hauteur. Avec un niveau fixe, la section s'adapte à la
  scène ; avec `Hauteur de section`, c'est la scène qui s'adapte à la section.
- **Espacement inférieur** définit la distance par rapport au bloc suivant dans la même
  section. L'espacement intérieur d'une section suivante appartient à celle-ci et
  est conservé.
- Avec l’option `Hauteur de section`, la scène n’occupe la hauteur de la section que si
  elle s’y trouve seule. S’il y a d’autres blocs dans la même section, elle conserve
  son rapport hauteur/largeur, et les blocs s’approchent d’elle sans espace.
- Les commandes n’apparaissent qu’à partir de la deuxième diapositive. Sur les
  écrans étroits, les flèches sont masquées ; dans ce cas, on utilise le balayage.
- Un article supprimé ou non visible pour le lecteur
  n’emporte avec lui que sa propre diapositive. Les autres diapositives restent en place.
- Les diapositives d’actualités suivent la langue du lecteur, dans la mesure où l’article
  est traduit ; sinon, elles suivent la première version disponible.
- L’**aperçu** sur ordinateur, tablette et mobile applique aux articles d’actualité les
  mêmes règles que la page publiée. Ce qui n’y figure pas
  n’apparaît pas non plus sur la scène.

## Diapositive personnalisée

Avec **Structure : Personnalisée**, la scène au centre est un espace de travail
composé de neuf zones — en haut, au centre, en bas, respectivement à gauche, au centre et à droite sur la
ligne d’alignement. Le panneau de droite contient le catalogue des modules.

| Module | Paramètres |
| --- | --- |
| Titre | Texte, taille (**Display**, **H1**–**H3**), couleur. Le premier titre de la diapositive est son titre principal. |
| Texte | Texte, taille (**L**, **M**, **S**), couleur. |
| Libellé | Court texte au-dessus d’un titre, couleur. |
| Boutons | Jusqu’à trois boutons, comme pour la diapositive fixe. |
| Image ou logo | Provenant de la médiathèque ou via une adresse, description, taille : **S** un tiers, **M** deux tiers, **L** toute la largeur de la zone — au maximum un cinquième, deux cinquièmes ou trois cinquièmes de la hauteur de la scène (sur mobile, pour **L**, un peu moins de la moitié). Pour une grande image, élargissez la zone (**Largeur**). Les images détourées (PNG, SVG) s’affichent sur n’importe quel arrière-plan. |
| Icône | Symbole, taille, couleur. |

Pour chaque module, voir également : **Zone** (une sélection 3×3 comme la scène),
**Masquer sur mobile** et, en haut, **vers le haut**, **vers le bas**, **dupliquer**,
**supprimer**. **Couleur : Auto** suit la diapositive — blanc ou anthracite, selon
ce qui est le plus lisible sur l’arrière-plan.

**Alignement par zone :** un clic sur le nom d’une zone (ou sur sa zone vide
) affiche à droite **Horizontalement dans la zone** (**Gauche**, **Centre**,
**Droite**) et **Verticalement dans la zone** (**Haut**, **Centre**, **en bas**). Elles
s’appliquent à tous les blocs de la zone ; ces mêmes champs figurent également dans les
paramètres de chaque bloc. La position par défaut correspond à celle de la zone — « en bas à gauche »
signifie en bas à gauche.

**Regrouper les zones :** Sous l’alignement, on trouve **Largeur** (**1 colonne**,
**2 colonnes**, **3 colonnes**) et **Hauteur** (**1 ligne**, **2 lignes**,
**3 lignes**). Ainsi, la rangée supérieure devient par exemple une zone (« en haut, toute la
largeur ») ou la colonne de gauche (« à gauche, toute la hauteur »). La zone s’étend d’abord
vers la droite ou vers le bas, puis vers la gauche ou vers le haut à partir du bord ; les blocs des
zones superposées viennent derrière les leurs, l’alignement est conservé. En cas de
réduction, la zone reste du côté où se trouvent ses blocs. Une
taille qui ne recouvrirait qu’en partie une autre zone regroupée n’est pas
proposée.

En mode **Mobile**, les zones s’affichent les unes en dessous des autres dans l’ordre de lecture (en haut à gauche, en haut
au centre, en haut à droite, au centre à gauche… ; une zone regroupée se trouve à l’emplacement
de son coin supérieur gauche) ; les éléments alignés à droite se déplacent vers la gauche,
ceux centrés restent centrés, les boutons restent des boutons. Ce qui est superflu sur le téléphone est masqué par **Masquer sur mobile**
; vous pouvez vérifier cela ci-dessus avec **Mobile**.
