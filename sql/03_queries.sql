
-- 1. Lister les bières par taux d'alcool croissant
SELECT name, alcohol_deg FROM beer ORDER BY alcohol_deg ASC;

-- 2. Afficher le nombre de bières par catégorie ou style
SELECT c.name, COUNT(*) AS beer_count
FROM category c
LEFT JOIN beer_category bc ON c.id = bc.category_id
GROUP BY c.name;

-- 3. Trouver toutes les bières d'une brasserie donnée
SELECT beer.name, brewery.name
FROM beer
JOIN brewery ON beer.brewery_id = brewery.id
WHERE brewery_id = 1;

-- 4.Lister les utilisateurs et le nombre de bières ajoutées à leurs favoris
SELECT u.first_name, u.last_name, COUNT(ubf.beer_id)
FROM app_user u
JOIN user_beer_favorite ubf on ubf.app_user_id = u.id
GROUP BY u.id, u.first_name, u.last_name;

-- 5.Ajouter une nouvelle bière à la base de données
INSERT INTO beer (name, description, alcohol_deg, price, brewery_id)
VALUES ('Triple Karmeliet', 'Bière belge dorée aux trois céréales', 8.4, 3.50, 1);

-- 6.Afficher les bières avec leur brasserie, triées par pays
-- pas possible dans mon cas car l'adresse est un seul champ donc j'affiche seulement les bieres avec leurs brasseries
SELECT beer.name, brewery.name
FROM beer
JOIN brewery ON brewery.id = beer.brewery_id;

-- 7.Lister les bières avec leurs ingrédients
SELECT b.name AS beer_name, i.name AS ingredient_name
FROM beer b
LEFT JOIN beer_ingredient bi ON bi.beer_id = b.id
LEFT JOIN ingredient i ON i.id = bi.ingredient_id;

-- 8.Afficher les brasseries produisant plus de cinq bières
SELECT br.name AS brewery_name, COUNT(b.id) AS beer_count
FROM brewery br
JOIN beer b ON b.brewery_id = br.id
GROUP BY br.id, br.name
HAVING COUNT(b.id) > 5;
