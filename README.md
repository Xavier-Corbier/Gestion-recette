# ![](https://www.polytech.umontpellier.fr/images/logo_entete.png) Projet - AWI
### Polytech Montpellier & Informatique et Gestion

* **Groupe :** [Sébastien Gineste](https://sebastiengineste.fr/), [Xavier Corbier](https://xaviercorbier.fr)
* **Matière :** AWI

# Gestion de fiches techniques de cuisine : Projet - AWI
Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 13.

L’objectif est de permettre de réaliser facilement des fiches techniques de cuisines pour la préparation de plats dans un restaurant.
##Les fiches techniques
Une fiche technique d’un plat peut être assimilée à une recette mais utilise des termes techniques
de la profession. Elle présente également des calculs de coûts de production et de prix de vente. Le
plat est bien sûr prévu pour un certain nombre de couverts.
La description de la réalisation du plat, appelée progression, est décomposée en étapes, chacune
décrivant sur la droite la technique pour réaliser cette étape, et sur la gauche les ingrédients et leur
quantités.
Une étape peut être décrite in extenso mais peut aussi être la progresion d’une fiche technique
déjà écrite, elle-même pouvant contenir plusieurs étapes.
Au final une fiche technique contient trois parties :
1. un en-tête composé du nom du plat, du nom de l’auteur et du nombre de couverts ;
2. la progression, décomposée en étapes, chaque étape comprenant un titre, une description
   sur la droite, les ingrédients avec leurs quantités sur la gauche et le temps nécessaire pour la
   réaliser ;
3. la synthèse des ingrédients et des coûts : un rappel complet de tous les ingrédients nécessaires
   pour toutes les étapes et un calcul de coûts (voir section 3). 
##La liste des ingrédients
   Les ingrédients possèdent un nom, une catégorie, une unité et une quantité de cette unité. Ils
   ont aussi un prix unitaire. Ils sont répertoriés dans une mercuriale .
   Dans une progression, seuls sont indiqués le nom de l’ingrédient, son unité et sa quantité, la
   quantité s’entendant pour le nombre de couverts prévus.
   Dans la synthèse, on indique la liste des ingrédients par catégorie en caculant le coût brut de ces
   ingrédients.
   Il faut pouvoir indiquer si des ingrédients sont allergènes ou pas. On gèrera donc aussi une liste
   d’allergènes, répartis par catégorie d’allergènes (voir listes des allergènes). 
   ##Le calcul des coûts
   Le calcul des coûts se fait à partir du coût matière, auquel on rajoute éventuellement des charges
   (fluides et personnels). À ce coût de production, on applique un coefficient pour calculer le prix de
   vente. On peut alors en déduire le bénéfice par portion et le seuil de rentabilité.
   Le coût de production total est obtenu par la somme du coût matière et éventuellement du coût
   des charges. Parfois, on ne calcule pas le coût des charges, le coût de production est alors égal au
   coût matière et le calcul du prix de vente est alors fait différemment (voir section 3).

Une mercuriale n’est rien d’autre que le nom technique pour cette liste avec unité et prix unitaire

   coût matière :
   — on calcule le coût total des ingrédients de la fiche,
   — on rajoute un coût assaisonnement (coût en euro ou 5% du coût matière).
   coût des charges : il est la somme du coût du personnel et du coût des fluides,
   coût du personnel : calculé à partir d’un coût horaire moyen et du temps total pour réaliser
   le plat,
   coût des fluides : calculé aussi à partir d’un coût horaire forfaitaire.
   On peut alors en déduire également un coût de production par portion.
   Le prix de vente est calculé à partir du coût de production en appliquant un coefficient multiplicateur à celui-ci. Selon si on a calculé le coût des charges ou pas, on utilisera deux coefficients
   différents :
   — celui utilisé lorsqu’on a évalué le coût des fluides et du personnel ;
   — celui utilisé si on n’a pas évalué ces coûts : le coefficient est alors bien plus important.
   À partir du prix de vente total, on peut alors calculer le prix de vente par portion, le bénéfice
   éventuel, total ou par portion, et le seuil de rentabilité, c’est à dire combien, au minimum, de portions
   il faudra vendre pour rentrer dans ses frais et commencer à gagner de l’argent.
   Attention, le prix de vente est calculé ttc en appliquant le coefficient au coût de production. Il
   faut donc déduire la tva, unique de 10%, avant de calculer le bénéfice et le seuil de rentabilité.
   ##Gestion des stocks
   Enfin, on veut pouvoir éventuellement gérer des stocks et donc faire rentrer dans l’inventaire des
   ingrédients et ensuite diminuer les quantités lorsqu’il y a des ventes.
   Ici les ventes pourront être réalisées de deux manières :
   — en indiquant directement un nombre de plats vendus
   — ou symbolisées par l’impression d’un certains nombre d’étiquettes pour la vente à emporter de
   plats : une étiquette contient le nom du plat ainsi que la liste des ingrédients, les ingrédients
   allergènes devant être écrits en gras.
   ##Autres demandes
   Bien sûr, toutes ces données, ingrédients, fiches techniques, etc... doivent être enregistrée dans
   une base de données et on doit pouvoir les gérer, ainsi :
   — Il faut avoir des catégories de recettes (entrée, plat, accompagnement...) mais aussi des catégories d’ingrédients (légumes, fruits, poissons...)
   — Il faut pouvoir rechercher des recettes : par nom de recette, par catégorie de recette, par
   ingrédient.
   — Il faut pouvoir sortir l’impression d’une fiche technique avec et sans coûts
   — les coûts moyen et forfaitaires et les deux coefficients sont des paramètres de l’application :
   il doivent pouvoir être gérés et sont utilisés comme valeur par défaut dans une fiche. On doit
   pouvoir cependant appliquer un coût ou un coefficient particulier à une fiche.
   — il faudrait pouvoir, en modifiant le nombre de couverts prévus initialement, recalculer les
   quantités et les coûts et recréer ou modifier la fiche technique en base.
   — Il faut pouvoir sortir une ou des étiquettes sans que cela ne soit une vente.
