# Paramètres

| Paramètre | Description |
| --- | --- |
| Entrées | Contenu de la scène : diapositives personnalisées, articles d'actualité individuels et chaînes d'actualité complètes. Ces éléments sont gérés via l'éditeur, qui s'affiche automatiquement à l'ouverture des paramètres. Le champ de texte situé en dessous contient le texte brut et ne doit pas être modifié. |
| Hauteur | `Standard (420–560 px)` est l'option par défaut. À côté, vous trouverez `Faible (320–420 px)`, `Élevée (560–720 px)` et `Hauteur de l'écran`. |
| Afficher sur toute la largeur | Lorsque cette option est activée (réglage par défaut), l’image s’étend sur toute la largeur de la fenêtre, tandis que le texte reste aligné sur la ligne de flottaison de la page. Lorsqu’elle est désactivée, la scène reste dans la colonne de contenu. |
| Secondes par diapositive | La valeur par défaut est `5`. La valeur `0` met la scène en pause ; le défilement s’effectue alors uniquement à l’aide des flèches et des traits — et si les commandes sont désactivées, uniquement par glissement et à l’aide des touches fléchées. Maximum 30. |
| Position par rapport au fil d’Ariane | `Après le fil d’Ariane` est la valeur par défaut : la scène commence sous la ligne du fil d’Ariane. `Avant le fil d’Ariane` la place au ras du menu et déplace le fil d’Ariane en dessous. Ne s'applique que si la scène se trouve en haut de la page et si la page comporte des fils d'Ariane. |
| Afficher les commandes | Lorsque cette option est activée (réglage par défaut), les flèches et les tirets s'affichent. Lorsqu’elles sont désactivées, les deux disparaissent ; la navigation se poursuit par glissement et à l’aide des touches fléchées, et la durée définie par diapositive reste inchangée. |

## Types d’entrées

| Type | Description |
| --- | --- |
| Diapositive | Une diapositive gérée manuellement : image, titre, sous-titre, bouton. |
| Article d’actualité | Un article spécifique sous forme de diapositive. Le contenu et la destination proviennent de l’article. |
| Chaîne d’actualités | Une chaîne entière, une diapositive par article. Les nouveaux articles apparaissent sans intervention supplémentaire. |

Ces trois types d’entrées figurent dans la même liste ; elles peuvent être mélangées et triées à l’aide des touches **↑** et
**↓**. Au total, la scène affiche au maximum huit diapositives — une
entrée de chaîne compte alors pour toutes les diapositives qu’elle apporte.

## Champs d’une diapositive

| Champ | Description |
| --- | --- |
| Image ou vidéo | Obligatoire. Provenant de la médiathèque ou via une adresse (`https://…`). Horizontale, d’au moins 1920 px de large. Sans image ni vidéo, la diapositive n’est pas affichée. |
| Adresse | À la place de la médiathèque : l’adresse `https` d’une image ou d’une vidéo. Les autres adresses ne sont pas prises en compte. |
| Type | Image ou vidéo. Se définit automatiquement en fonction de l’extension de l’adresse (`.mp4`, `.webm`, `.mov` sont des vidéos) ; à sélectionner manuellement uniquement pour les adresses sans extension. |
| Description de l’image ou de la vidéo | Ce qui est visible. Ne laisser ce champ vide que pour les images et vidéos purement décoratives — les lecteurs d'écran lisent ce champ à voix haute. |
| Image ou vidéo au format portrait | Facultatif. S'affiche sur les écrans étroits et verticaux. En l'absence de cette option, le recadrage en format paysage est utilisé partout. |
| Titre | À rester concis : jusqu’à environ 24 caractères pour qu’il tienne sur une seule ligne. |
| Sous-titre | Facultatif, une à deux lignes. |
| Bouton | Facultatif. N’apparaît que si le libellé et la destination sont renseignés. Un seul par diapositive au maximum. |
| Ouvrir dans un nouvel onglet | Ouvre la destination du bouton dans un nouvel onglet. Couramment utilisé pour les destinations externes. |

## Champs d’un article d’actualité

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Détermine les articles disponibles. |
| Article | Obligatoire. Les cinquante articles les plus récents de la chaîne, les plus récents en premier. |
| Remplacer le titre | Facultatif. Laisser vide pour reprendre le titre de l'article. |
| Afficher le teaser en sous-titre | Activé par défaut. Le teaser est raccourci à 240 caractères. |
| Libellé du bouton | « En savoir plus » par défaut. Laisser vide pour ne pas afficher le bouton ; la destination est toujours l’article. |
| Remplacer l’image de fond | Facultatif. Utile si l’image de l’article est trop recadrée pour servir d’image de fond. |
| Image pour format portrait | Facultatif. Affichée sur les écrans étroits en mode portrait. |

## Champs d’un canal d’actualités

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Toutes les diapositives de cette entrée proviennent de cette chaîne. |
| Nombre de diapositives | `3` par défaut, huit au maximum. |
| Ordre | `Les plus récentes en premier` (par défaut) ou `Les plus anciennes en premier`. |
| Uniquement les publications mises en avant | Désactivé par défaut. Limité aux publications épinglées dans les actualités. |
| Uniquement les publications avec image | Activé par défaut. Sans image, la diapositive ne serait qu’une surface sombre avec du texte. |
| Mots-clés | Facultatif, plusieurs séparés par des virgules. Un article suffit s’il en comporte un. |
| Afficher le teaser en sous-titre | Activé par défaut. |
| Libellé du bouton | S'applique à toutes les diapositives de la chaîne. Laisser vide pour ne pas afficher le bouton. |

## Remarques

- **Hauteur** sert de limite, et non de hauteur fixe : la scène s'adapte aux
  et sur les écrans étroits 4:3, et n’est bloquée qu’aux limites du
  niveau sélectionné.
- `Hauteur de l’écran` remplit la partie visible de l’écran, hors en-tête,
  avec un minimum de 420 px.
- **Secondes par diapositive** ne s’applique qu’à partir de la deuxième diapositive.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne verront pas
  les changements s’afficher automatiquement, quel que soit ce paramètre.
- Les commandes n’apparaissent qu’à partir de la deuxième diapositive. Sur les
  écrans étroits, les flèches sont masquées ; il faut alors faire glisser le doigt.
- Une contribution supprimée ou non visible pour le lecteur
  n’emporte avec elle que sa propre diapositive. Les autres diapositives restent en place.
- Les diapositives d’actualités suivent la langue du lecteur, dans la mesure où la publication
  est traduite ; sinon, elles suivent la première version disponible.
- L’**aperçu** dans l’éditeur applique les mêmes règles que la
  page publiée. Ce qui n’y figure pas n’apparaîtra pas non plus sur la scène
  .
