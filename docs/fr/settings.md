# Paramètres

| Paramètre | Description |
| --- | --- |
| Diapositives | Images, textes et boutons de la scène. Elles sont gérées via l’éditeur de diapositives, qui s’affiche automatiquement à l’ouverture des paramètres. Le champ de texte situé en dessous correspond au texte brut et ne doit pas être modifié. |
| Hauteur | `Standard (420–560 px)` est la valeur par défaut. À côté, `Faible (320–420 px)`, `Élevée (560–720 px)` et `Hauteur de l'écran`. |
| Afficher sur toute la largeur | Lorsque cette option est activée (réglage par défaut), l’image s’étend sur toute la largeur de la fenêtre, tandis que le texte reste aligné sur la marge de la page. Lorsqu’elle est désactivée, la scène reste dans la colonne de contenu. |
| Durée par diapositive | La valeur par défaut est `5`. La valeur `0` met la scène en pause ; le défilement s’effectue alors uniquement à l’aide des flèches et des tirets. Maximum 30. |

## Champs d’une diapositive

| Champ | Description |
| --- | --- |
| Image | Obligatoire. Paysage, largeur minimale de 1920 px. Sans image, la diapositive n’est pas affichée. |
| Description de l’image | Ce que l’on voit sur l’image. Ne laisser ce champ vide que pour les images purement décoratives — les lecteurs d’écran lisent ce champ à voix haute. |
| Image pour format portrait | Facultatif. S'affiche sur les écrans étroits en mode portrait. En l'absence d'image, le recadrage en mode paysage est utilisé partout. |
| Titre | S'affiche en majuscules. Il reste sur une seule ligne jusqu'à environ 24 caractères. |
| Sous-titre | Facultatif, une à deux lignes. |
| Bouton | Facultatif. N’apparaît que si le libellé et la destination sont renseignés. Un seul par diapositive au maximum. |
| Ouvrir dans un nouvel onglet | Ouvre la destination du bouton dans un nouvel onglet. Couramment utilisé pour les destinations externes. |

## Remarques

- **Hauteur** sert de limite, et non de hauteur fixe : la scène est au format 21:9 sur les
  écrans larges et au format 4:3 sur les écrans étroits, et n'est bloquée qu'aux limites du
  niveau sélectionné.
- `Hauteur de l'écran` remplit la partie visible de l'écran, hors en-tête,
  avec un minimum de 420 px.
- **Secondes par diapositive** ne s'applique qu'à partir de la deuxième diapositive.
- Les utilisateurs ayant activé l’option « Réduire les animations » dans leur système d’exploitation ne verront pas
  le changement en eux-mêmes, quel que soit ce paramètre.
- Les commandes n’apparaissent qu’à partir de la deuxième diapositive. Sur les écrans étroits,
  les flèches sont masquées ; il faut alors faire un balayage du doigt.
