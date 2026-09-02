# FAQ

**Question :** J'ai créé une diapositive, mais la zone de présentation reste vide.

Réponse : Il manque une image à la diapositive. Les diapositives sans image ne s'affichent pas — une
zone sombre et vide serait impossible à distinguer d'une erreur sur la page.
Ouvrez l'éditeur et sélectionnez une image sous **Image**.

**Question :** J'ai saisi un libellé pour le bouton, mais
il n'apparaît pas.

Réponse : Le bouton a besoin des **deux** : un libellé et une destination. Tant que
l’un des champs est vide, il ne s’affiche pas.

**Question :** L’image ne s’étend pas sur toute la largeur de la fenêtre.

Réponse : Il y a deux causes possibles. Soit l’option **Afficher sur toute la largeur**
est désactivée, soit le widget se trouve dans une colonne à côté d’autres contenus.
Placez-le sur une ligne à part, en haut de la page.

**Question :** Le texte ne se trouve pas à l’endroit où commence le reste du contenu de la page.

Réponse : La zone d’édition s’adapte à la largeur de contenu indiquée par la page.
Si celle-ci diffère, signalez le problème en indiquant l’adresse de la page.

**Question :** À la place de l’éditeur, je vois un champ de texte « Entrées » contenant des
accolades.

Réponse : L’éditeur n’a pas pu s’intégrer à la boîte de dialogue. Fermez
les paramètres et rouvrez-les. Le texte dans le champ correspond à la
version brute des entrées ; ne le modifiez pas manuellement — une faute de frappe
dans ce champ ferait disparaître toutes les diapositives.

**Question :** La scène ne change pas automatiquement.

Réponse : Il y a trois causes possibles : il n’y a qu’une seule diapositive ; le paramètre **« Secondes par diapositive »**
est réglé sur `0` ; ou l’option « Réduire les animations » est activée dans le système d’exploitation.
Dans ce dernier cas, c'est voulu — vous pouvez toujours faire défiler les diapositives à l'aide des flèches
et des traits.

**Question :** Je ne vois pas de flèches sur mon téléphone.

Réponse : C'est normal. Sur les écrans étroits, on fait glisser le doigt ; les
lignes sous le texte indiquent toujours quelle diapositive est actuellement au premier plan.

**Question :** Mon motif est rogné sur les bords.

Réponse : La scène recadre l’image au format 21:9 ou 4:3 en fonction de la largeur de la fenêtre. Choisissez
une image laissant de la marge autour du motif, ou ajoutez sous **Image pour
format portrait** votre propre recadrage orienté à la verticale.

**Question :** Puis-je créer plus de huit diapositives ?

Réponse : Non. À raison de cinq secondes par diapositive, un cycle complet dure déjà, avec
huit diapositives, quarante secondes — personne ne reste aussi longtemps sur une scène.
Le nombre huit s’applique à l’ensemble des diapositives : une entrée de chaîne comportant cinq articles
ne permet d’ajouter que trois diapositives supplémentaires.

**Question :** Dois-je mettre à jour la scène lorsqu’un nouvel article
apparaît dans les actualités ?

Réponse : Pas dans le cas d’une entrée de **chaîne d’actualités** — elle affiche toujours les
articles actuels de la chaîne selon les filtres définis. Une entrée **« Publication d’actualité »**,
en revanche, reste liée à la publication que vous avez sélectionnée.

**Question :** Une diapositive issue des actualités a soudainement disparu.

Réponse : La publication a été supprimée, déplacée ou n’est pas visible pour le lecteur. Seule cette diapositive a disparu ; les autres restent affichées.

**Question :** Mon entrée de chaîne affiche moins de diapositives que ce qui est configuré.

Réponse : La plupart du temps, les filtres sont trop restrictifs. L’option **« Uniquement les articles avec image »** est
sélectionnée par défaut — une chaîne sans images ne fournit donc aucun résultat. Vérifiez l’
aperçu dans l’éditeur : il affiche exactement ce qui apparaîtra à l’écran.

**Question :** Dans la sélection des chaînes, il n’y a pas une seule chaîne, mais un
champ de texte pour saisir un identifiant.

Réponse : La liste des chaînes d’actualités n’était pas accessible. Rechargez la boîte de dialogue.
Si cela ne fonctionne pas, saisissez manuellement l’identifiant de la chaîne ; il figure
dans l’adresse de la chaîne dans le CMS.

**Question :** Pourquoi l’image d’un article d’actualité est-elle floue ou
cadrée de manière étrange sur la scène ?

Réponse : Les images d'articles sont recadrées pour le format de flux, et non pour une
scène occupant toute la hauteur de l'écran. Dans l'entrée, sous **Remplacer l'image de scène**,
définissez votre propre image, au format paysage et d'au moins 1920 px de large.
