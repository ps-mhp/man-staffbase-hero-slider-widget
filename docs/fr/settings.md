# Paramètres

| Paramètre | Description |
| --- | --- |
| Entrées | Contenu de la scène : diapositives personnalisées, articles d'actualité individuels et chaînes d'actualité complètes. Géré via l'éditeur qui s'affiche automatiquement à l'ouverture des paramètres. Le champ de texte situé en dessous correspond au brouillon et ne doit pas être modifié. |
| Hauteur | `Standard (420–560 px)` est l'option par défaut. À côté : `Faible (320–420 px)`, `Élevée (560–720 px)` et `Hauteur de l'écran`. |
| Afficher sur toute la largeur | Lorsque cette option est activée (par défaut), l’image s’étend sur toute la largeur de la fenêtre, tandis que le texte reste aligné sur la marge de la page. Lorsqu’elle est désactivée, la scène reste dans la colonne de contenu. |
| Secondes par diapositive | La valeur par défaut est `5`. La valeur `0` met la scène en pause ; le défilement s’effectue alors uniquement à l’aide des flèches et des traits. Maximum 30. |

## Types d’entrées

| Type | Description |
| --- | --- |
| Diapositive | Une diapositive gérée manuellement : image, titre, sous-titre, bouton. |
| Article d’actualité | Un article spécifique sous forme de diapositive. Le contenu et la destination proviennent de l’article. |
| Chaîne d’actualités | Une chaîne entière, une diapositive par article. Les nouveaux articles s’affichent automatiquement. |

Ces trois types d’entrées figurent dans la même liste ; elles peuvent être mélangées et triées à l’aide des boutons **↑** et
**↓**. Au total, la scène affiche au maximum huit diapositives — une
entrée de chaîne compte alors pour toutes les diapositives qu’elle apporte.

## Champs d’une diapositive

| Champ | Description |
| --- | --- |
| Image | Obligatoire. Format paysage, largeur minimale de 1 920 px. Sans image, la diapositive n’est pas affichée. |
| Description de l’image | Ce que l’on voit sur l’image. Ne laisser ce champ vide que pour les images purement décoratives — les lecteurs d’écran lisent ce champ à voix haute. |
| Image pour format portrait | Facultatif. S’affiche sur les écrans étroits en mode portrait. En l’absence de cette image, le recadrage en mode paysage est utilisé partout. |
| Titre | S'affiche en majuscules. Jusqu'à environ 24 caractères, il tient sur une seule ligne. |
| Sous-titre | Facultatif, une à deux lignes. |
| Bouton | Facultatif. N'apparaît que si le libellé et la destination sont renseignés. Un seul par diapositive au maximum. |
| Ouvrir dans un nouvel onglet | Ouvre la destination du bouton dans un nouvel onglet. Couramment utilisé pour les destinations externes. |

## Champs d'un article d'actualité

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Détermine les articles disponibles. |
| Article | Obligatoire. Les cinquante articles les plus récents de la chaîne, les plus récents en premier. |
| Remplacer le titre | Facultatif. Laisser vide pour reprendre le titre de l'article. |
| Afficher le teaser en sous-titre | Activé par défaut. Le teaser est raccourci à 240 caractères. |
| Libellé du bouton | `En savoir plus` par défaut. Laisser vide pour ne pas afficher le bouton ; la destination est toujours l’article. |
| Remplacer l’image de fond | Facultatif. Utile si l’image de l’article est trop recadrée pour servir d’image de fond. |
| Image pour le format portrait | Facultatif. Affichée sur les écrans étroits en mode portrait. |

## Champs d’un canal d’actualités

| Champ | Description |
| --- | --- |
| Chaîne | Obligatoire. Toutes les diapositives de cette entrée proviennent de cette chaîne. |
| Nombre de diapositives | `3` par défaut, huit au maximum. |
| Ordre | `Les plus récentes en premier` (par défaut) ou `Les plus anciennes en premier`. |
| Uniquement les publications mises en avant | Désactivé par défaut. Limité à ce qui est épinglé dans les actualités. |
| Uniquement les publications avec image | Activé par défaut. Sans image, la diapositive ne serait qu’une surface sombre avec du texte. |
| Mots-clés | Facultatif, plusieurs séparés par des virgules. Une publication suffit si elle en comporte un. |
| Afficher le teaser en sous-titre | Activé par défaut. |
| Libellé du bouton | S'applique à toutes les diapositives de la chaîne. Laisser vide pour ne pas afficher le bouton. |

## Remarques

- **Hauteur** sert de limite, et non de hauteur fixe : la scène s'adapte aux
  et sur les écrans étroits 4:3, et n’est verrouillée qu’aux limites du
  niveau sélectionné.
- `Hauteur de l’écran` remplit la partie visible de l’écran, hors en-tête,
  avec un minimum de 420 px.
- **Secondes par diapositive** ne s’applique qu’à partir de la deuxième diapositive.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne verront pas
  les changements s’afficher automatiquement, quel que soit ce paramètre.
- Les éléments de commande n’apparaissent qu’à partir de la deuxième diapositive. Sur les
  écrans étroits, les flèches sont masquées ; il faut alors faire glisser le doigt.
- Un article supprimé ou non visible par le lecteur
  n’emporte avec lui que sa propre diapositive. Les autres diapositives restent en place.
- Les diapositives d’actualités suivent la langue du lecteur, dans la mesure où la contribution
  est traduite ; sinon, elles suivent la première version disponible.
- L’**aperçu** dans l’éditeur applique les mêmes règles que la
  page publiée. Ce qui n’y figure pas n’apparaîtra pas non plus sur la scène
  .
