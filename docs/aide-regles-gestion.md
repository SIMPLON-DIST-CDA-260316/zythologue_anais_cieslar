# Questions pour construire les règles de gestion

Ce support vous aide à passer d'un besoin métier à des règles de gestion claires.

Une règle de gestion doit être formulée comme une phrase métier. Elle doit expliquer ce qui est possible, obligatoire ou interdit dans le domaine étudié.

---

## Comprendre le métier

Avant de dessiner un modèle, commencez par clarifier le besoin.

- Quel est l'objectif de l'application ?
- Qui utilise l'application ?
- Quels sont les objets importants du métier ?
- Quelles informations souhaite-t-on conserver ?
- Quelles actions les utilisateurs peuvent-ils réaliser ?

---

## Identifier les entités

Pour chaque objet identifié, posez-vous les questions suivantes :

- Existe-t-il réellement dans le métier ?
- Possède-t-il sa propre identité ?
- Souhaite-t-on mémoriser des informations sur lui ?
- Peut-il exister indépendamment des autres objets ?

Exemples d'objets métier possibles pour Zythologue :

- utilisateur
- bière
- brasserie
- catégorie ou style
- avis
- photo
- ingrédient

---

## Identifier les relations

Pour chaque paire d'entités, cherchez s'il existe un lien métier.

- Existe-t-il un lien entre elles ?
- Quelle action les relie ?
- Quel verbe permet de décrire cette relation ?

Exemples de verbes utiles :

- appartient à
- possède
- contient
- publie
- consulte
- note
- participe à
- produit
- illustre
- compose

Exemples appliqués au projet :

- Une brasserie produit une bière
- Une bière appartient à une catégorie
- Un utilisateur publie un avis
- Une bière contient des ingrédients
- Une photo illustre une bière

---

## Déterminer les cardinalités

Pour chaque relation, raisonnez dans les deux sens.

### Question 1

Combien de B pour un A ?

Exemples :

- Combien de bières pour une brasserie ?
- Combien d'avis pour une bière ?
- Combien de photos pour une bière ?

### Question 2

Combien de A pour un B ?

Exemples :

- Combien de brasseries pour une bière ?
- Combien de bières pour un avis ?
- Combien d'utilisateurs pour un avis ?

### Question 3

La relation est-elle obligatoire ?

Exemples :

- Une bière doit-elle appartenir à une brasserie ?
- Une bière doit-elle avoir une photo ?
- Un utilisateur doit-il avoir des favoris ?
- Un avis peut-il exister sans bière ?

---

## Trouver les règles métier

Pour chaque entité, utilisez les formulations suivantes.

### Peut

- Un utilisateur peut-il créer plusieurs avis ?
- Une bière peut-elle avoir plusieurs ingrédients ?
- Une brasserie peut-elle produire plusieurs bières ?
- Une bière peut-elle avoir plusieurs photos ?

### Doit

- Une bière doit-elle appartenir à une catégorie ?
- Un avis doit-il être associé à un utilisateur ?
- Une photo doit-elle être liée à une bière ?
- Un favori doit-il associer un utilisateur et une bière ?

### Peut-il exister sans

- Une bière peut-elle exister sans brasserie ?
- Une photo peut-elle exister sans bière ?
- Un avis peut-il exister sans utilisateur ?
- Un ingrédient peut-il exister sans bière ?

---

## Vérifier les contraintes métier

Les règles de gestion ne servent pas seulement à trouver les relations. Elles permettent aussi de préparer les contraintes SQL.

- Quelles informations doivent être obligatoires ?
- Quelles informations doivent être uniques ?
- Existe-t-il des valeurs minimales ou maximales ?
- Certaines données peuvent-elles être calculées ?
- Certaines données risquent-elles d'être dupliquées ?
- Certaines suppressions doivent-elles être interdites ?
- Certaines suppressions doivent-elles supprimer aussi les données liées ?

Exemples de contraintes possibles :

- Un email utilisateur doit être unique
- Une note doit être comprise entre 1 et 5
- Un taux d'alcool ne peut pas être négatif
- Un prix ne peut pas être négatif
- Un même utilisateur ne doit pas ajouter deux fois la même bière en favori

---

## Vérification finale

Votre modèle commence à être clair si vous pouvez compléter ces phrases :

- Un utilisateur peut ...
- Un utilisateur doit ...
- Une bière peut ...
- Une bière doit ...
- Une brasserie peut ...
- Une brasserie doit ...
- Un avis concerne ...
- Une photo appartient à ...
- Un ingrédient peut ...
- Un favori associe ...

---

## Exemple de règles de gestion

Voici des exemples de formulation. Ils ne remplacent pas votre réflexion.

- Un utilisateur peut publier aucun, un ou plusieurs avis
- Un avis doit être publié par un seul utilisateur
- Un avis doit concerner une seule bière
- Une bière peut recevoir aucun, un ou plusieurs avis
- Une brasserie peut produire aucune, une ou plusieurs bières
- Une bière doit être produite par une seule brasserie
- Une bière peut être illustrée par aucune, une ou plusieurs photos
- Une photo doit illustrer une seule bière
- Une bière peut contenir un ou plusieurs ingrédients
- Un ingrédient peut entrer dans la composition de plusieurs bières
- Un utilisateur peut ajouter aucune, une ou plusieurs bières à ses favoris
- Une bière peut être ajoutée aux favoris par aucun, un ou plusieurs utilisateurs
