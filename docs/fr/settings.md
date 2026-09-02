# Décors

| Cadre | Description |
| --- | --- |
| Entrées | Le contenu de la scène : ses propres diapositives, articles d’actualité individuels et chaînes d’information entières. Maintenu via l’éditeur, qui s’affiche lors de l’ouverture des paramètres. Le champ texte ci-dessous est la version approximative et n’a pas besoin d’être touché. |
| Hauteur | « Par défaut (420-560 px) » est prédéfini. À côté « Faible (320-420 px) », « Haut (560-720 px) » et « Haut écran ». |
| Afficher la largeur complète | Lorsqu’elle est activée (par défaut), l’image traverse toute la largeur de la fenêtre, tandis que le texte reste sur la ligne nulle de la page. Lorsqu’elle est désactivée, la Phase reste dans la colonne de contenu. |
| Secondes par diapositive | « 5 » est la valeur par défaut. « 0 » arrête la scène ; alors seules les flèches et les tirets sont défilés. Maximum 30. |

## Types d’entrées

| Variété | Description |
| --- | --- |
| Diapositive | Une diapositive maintenue à la main : image, titre, sous-ligne, bouton. |
| Article d’actualité | Un article spécifique sous forme de diapositive. Le contenu et l’objectif proviennent de l’article. |
| Chaîne d’information | Une chaîne entière, une diapositive par publication. De nouvelles publications apparaissent sans action supplémentaire. |

Les trois sont dans la même liste, peuvent être mélangés via **↑** et
**↓** . Au total, la scène présente un maximum de huit diapositives — une seule
Les entrées sur la chaîne comptent avec toutes les diapositives qu’il contribue. 

## Champs d’un toboggan

| Champ | Description |
| --- | --- |
| Image | Obligatoire. Paysage, au moins 1920 px de large. Sans image, la diapositive ne sera pas montrée. |
| Description de l’image | Ce que l’on peut voir sur l’image. Ne laissez vide que pour les images purement décoratives — les lecteurs d’écran lisent ce champ. |
| Image pour format portrait | Optionnel. Affichée sur des écrans étroits et fixes. Si elle manque, le recadrage paysage est utilisé partout. |
| En-tête | Est écrit en majuscules. Jusqu’à environ 24 caractères, il reste à interligne simple. |
| Sous-ligne | Optionnel, une ou deux lignes. |
| Bouton | Optionnel. N’apparaît que si la légende et la destination sont remplies. Au plus une par diapositive. |
| Ouvrir dans un nouvel onglet | Ouvre la cible du bouton dans un nouvel onglet. Courant pour les cibles externes. |

## Champs d’un article de presse

| Champ | Description |
| --- | --- |
| Canal | Obligatoire. Détermine quels postes sont disponibles au choix. |
| Publication | Devoir. Les cinquante articles les plus récents de la chaîne, le plus récent en premier. |
| Écraser le titre | Optionnel. Laissez le bouton vide pour reprendre le titre du post. |
| Afficher le teaser en sous-ligne | Activé par défaut. Le teaser sera raccourci à 240 caractères. |
| Étiquette de bouton | « En savoir plus » par défaut. Laissez vide pour omettre le bouton ; le but est toujours le post. |
| Écraser la conception de la scène | Optionnel. Utile si l’image présentée est trop serrée pour la scène. |
| Image portrait | Optionnel. Affiché sur des écrans étroits et fixes. |

## Champs d’une chaîne d’information

| Champ | Description |
| --- | --- |
| Canal | Obligatoire. Toutes les diapositives de cette entrée proviennent de ce canal. |
| Nombre de diapositives | '3' par défaut, maximum huit. |
| Ordre | « Le plus récent en premier » (par défaut) ou « Le plus ancien en premier ». |
| Articles en vedette uniquement | Désactivé par défaut. Limité à ce qui est épinglé dans les actualités. |
| Seuls les posts avec image | Activé par défaut. Sans image, tout ce qui resterait de la diapositive serait une zone sombre avec du texte. |
| Tags | Optionnel, plusieurs séparés par virgule. Un poteau suffit s’il en porte un. |
| Afficher le teaser comme sous-ligne | Activé par défaut. |
| Étiquette de bouton | S’applique à toutes les diapositives du canal. Laissez vide pour omettre le bouton. |

## Notes

- **Hauteur** agit comme une limite, pas comme une hauteur fixe : la scène est en largeur
  écrans 21:9 et sur étroit 4:3 et n’est utilisé qu’aux limites de la
  étape sélectionnée. 
- « Screen-up » remplit la page visible à l’exception de l’en-tête, 
  Mais au moins 420 px. 
- **Secondes par diapositive** ne prend effet qu’à partir de la deuxième diapositive. 
- Si vous avez défini « Réduire le mouvement » dans le système d’exploitation, vous n’en verrez pas
  Le changement par lui-même — quel que soit ce contexte. 
- Les commandes n’apparaissent qu’à partir de la deuxième diapositive. Sur la version étroite
  écrans, les flèches sont cachées ; il y a du balayage. 
- Un post supprimé ou non visible pour la personne qui lit
  n’emporte que son propre fleuret avec lui. Les autres foils restent en place. 
- Les diapositives d’actualité suivent le langage de la personne qui lit, tant que l’article est présent
  est traduit ; sinon, la première version disponible. 
- L'**aperçu** dans l’éditeur calcule selon les mêmes règles que le
  page publiée. Ce qui n’est pas là apparaît aussi sur scène
  Non.