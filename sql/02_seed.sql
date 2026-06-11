-- ============================================================
-- SEEDS
-- ============================================================

-- ------------------------------------------------------------
-- BREWERY (20)
-- ------------------------------------------------------------
INSERT INTO brewery (name, address) VALUES
    ('Brasserie du Mont Blanc', '310 Route des Contamines, 74170 Saint-Gervais-les-Bains'),
    ('Brasserie Gallia', '36 Rue Polonceau, 75018 Paris'),
    ('Brasserie de la Senne', 'Rue Delaunoystraat 40, 1080 Bruxelles'),
    ('Brasserie Dupont', 'Rue Basse 5, 7904 Tourpes, Belgique'),
    ('Brasserie Thiriez', '1 Rue Principale, 59470 Esquelbecq'),
    ('Brasserie Cantillon', 'Rue Gheude 56, 1070 Bruxelles'),
    ('Brasserie Saint-Germain', '1 Rue de la Distillerie, 62130 Aix-Noulette'),
    ('Brasserie Ninkasi', '49 Rue Benoist Mary, 69100 Villeurbanne'),
    ('Brasserie de Bretagne', '1 Rue de la Brasserie, 29530 Landerneau'),
    ('Brasserie Goudale', 'Rue du Moulin, 59144 Hordain'),
    ('Brasserie La Débauche', '27 Rue du Dr Schweitzer, 16000 Angoulême'),
    ('Brasserie Deck & Donohue', '11 Rue de la République, 94220 Charenton-le-Pont'),
    ('Brasserie Chimay', 'Route Charlemagne 8, 6464 Baileux, Belgique'),
    ('Brasserie Orval', 'Abbaye d''Orval, 6823 Florenville, Belgique'),
    ('Brasserie Westmalle', 'Antwerpsesteenweg 496, 2390 Westmalle, Belgique'),
    ('Brasserie La Pleine Lune', '12 Rue des Artisans, 67000 Strasbourg'),
    ('Brasserie Sainte Cru', '4 Rue de la Paix, 33000 Bordeaux'),
    ('Brasserie du Vieux Singe', '8 Impasse des Brasseurs, 13001 Marseille'),
    ('Brasserie Mélusine', '2 Rue de l''Industrie, 85000 La Roche-sur-Yon'),
    ('Brasserie Sulauze', 'Domaine de Sulauze, 13140 Miramas');

-- ------------------------------------------------------------
-- CATEGORY (10)
-- ------------------------------------------------------------
INSERT INTO category (name) VALUES
    ('IPA'),
    ('Stout'),
    ('Blonde'),
    ('Brune'),
    ('Blanche'),
    ('Ambrée'),
    ('Saison'),
    ('Lambic'),
    ('Porter'),
    ('Sour');

-- ------------------------------------------------------------
-- INGREDIENT (15)
-- ------------------------------------------------------------
INSERT INTO ingredient (name) VALUES
    ('Malt d''orge'),
    ('Houblon Cascade'),
    ('Houblon Centennial'),
    ('Houblon Saaz'),
    ('Levure ale'),
    ('Levure lager'),
    ('Froment'),
    ('Avoine'),
    ('Coriandre'),
    ('Zeste d''orange'),
    ('Café'),
    ('Chocolat'),
    ('Miel'),
    ('Eau'),
    ('Sucre de canne');

-- ------------------------------------------------------------
-- APP_USER (10)
-- ------------------------------------------------------------
INSERT INTO app_user (last_name, first_name, email, password) VALUES
    ('Dupont', 'Marie', 'marie.dupont@email.com', '$2b$10$hashedpassword1'),
    ('Martin', 'Thomas', 'thomas.martin@email.com', '$2b$10$hashedpassword2'),
    ('Bernard', 'Julie', 'julie.bernard@email.com', '$2b$10$hashedpassword3'),
    ('Leroy', 'Nicolas', 'nicolas.leroy@email.com', '$2b$10$hashedpassword4'),
    ('Moreau', 'Sophie', 'sophie.moreau@email.com', '$2b$10$hashedpassword5'),
    ('Simon', 'Pierre', 'pierre.simon@email.com', '$2b$10$hashedpassword6'),
    ('Laurent', 'Emma', 'emma.laurent@email.com', '$2b$10$hashedpassword7'),
    ('Michel', 'Lucas', 'lucas.michel@email.com', '$2b$10$hashedpassword8'),
    ('Garcia', 'Camille', 'camille.garcia@email.com', '$2b$10$hashedpassword9'),
    ('David', 'Antoine', 'antoine.david@email.com', '$2b$10$hashedpassword10');

-- ------------------------------------------------------------
-- BEER (50)
-- ------------------------------------------------------------
INSERT INTO beer (name, description, alcohol_deg, price, brewery_id) VALUES
-- Brasserie du Mont Blanc (id=1)
('Mont Blanc Blonde', 'Blonde légère et rafraîchissante aux arômes floraux', 5.00, 3.50, 1),
('Mont Blanc IPA', 'IPA houblonnée avec des notes d''agrumes et de pin', 6.50, 4.20, 1),
('Mont Blanc Blanche', 'Blanche douce brassée avec du froment et de la coriandre', 4.50, 3.20, 1),

-- Brasserie Gallia (id=2)
('Gallia Lager', 'Lager parisienne légère et désaltérante', 4.80, 3.80, 2),
('Gallia IPA', 'IPA aux notes tropicales et résineuses', 6.20, 4.50, 2),
('Gallia Stout', 'Stout crémeux aux arômes de café et de chocolat noir', 5.50, 4.00, 2),

-- Brasserie de la Senne (id=3)
('Taras Boulba', 'Blonde extra-houblonnée légère et amère', 4.50, 3.90, 3),
('Zinnebir', 'Blonde amère aux notes florales et épicées', 6.00, 4.10, 3),
('Stouterik', 'Stout irlandais sec et torréfié', 4.50, 3.80, 3),

-- Brasserie Dupont (id=4)
('Saison Dupont', 'Saison classique belge sèche et épicée', 6.50, 4.50, 4),
('Moinette Blonde', 'Blonde belge forte aux arômes fruités', 8.50, 5.20, 4),
('Moinette Brune', 'Brune belge complexe aux notes de caramel', 8.50, 5.20, 4),

-- Brasserie Thiriez (id=5)
('Etoile du Nord', 'Blonde du Nord légère et houblonnée', 5.00, 3.60, 5),
('La Bavaisienne', 'Ambrée maltée aux notes de biscuit', 7.00, 4.80, 5),

-- Brasserie Cantillon (id=6)
('Gueuze 100% Lambic', 'Lambic traditionnel bruxellois acide et complexe', 5.00, 6.50, 6),
('Rosé de Gambrinus', 'Lambic à la framboise acidulé et fruité', 5.00, 7.00, 6),

-- Brasserie Saint-Germain (id=7)
('Page 24 Blonde', 'Blonde du Nord dorée et légèrement amère', 5.90, 3.70, 7),
('Page 24 Réserve Hildegarde', 'Ambrée complexe aux notes épicées', 6.80, 4.90, 7),

-- Brasserie Ninkasi (id=8)
('Ninkasi Pale Ale', 'Pale ale américaine aux arômes de fruits exotiques', 5.60, 3.80, 8),
('Ninkasi Ambrée', 'Ambrée ronde aux notes de caramel et de noisette', 5.80, 3.80, 8),
('Ninkasi Brune', 'Brune généreuse aux arômes de malt torréfié', 6.20, 4.00, 8),

-- Brasserie de Bretagne (id=9)
('Telenn Du', 'Stout breton à base de blé noir grillé', 4.50, 3.90, 9),
('Blanche Hermine', 'Blanche bretonne légère et fruitée', 4.70, 3.50, 9),

-- Brasserie Goudale (id=10)
('Goudale Blonde', 'Blonde brassée selon une recette ancienne', 7.20, 4.20, 10),
('Goudale Ambrée', 'Ambrée dorée aux arômes de malt caramélisé', 7.20, 4.20, 10),

-- Brasserie La Débauche (id=11)
('La Débauche IPA', 'IPA intense aux notes de pamplemousse et de résine', 6.80, 4.50, 11),
('La Débauche Sour', 'Sour acidulée aux fruits rouges', 5.20, 4.80, 11),

-- Brasserie Deck & Donohue (id=12)
('Deck & Donohue Stout', 'Stout irlandais sec et torréfié', 4.30, 4.00, 12),
('Deck & Donohue Session IPA', 'Session IPA légère et aromatique', 3.80, 3.80, 12),

-- Brasserie Chimay (id=13)
('Chimay Bleue', 'Trappiste forte aux arômes de fruits secs', 9.00, 5.50, 13),
('Chimay Rouge', 'Trappiste ambrée fruitée et épicée', 7.00, 4.80, 13),
('Chimay Blanche', 'Trappiste blonde légèrement amère', 8.00, 5.00, 13),

-- Brasserie Orval (id=14)
('Orval', 'Trappiste unique aux arômes boisés et Brett', 6.20, 5.00, 14),

-- Brasserie Westmalle (id=15)
('Westmalle Tripel', 'Tripel trappiste complexe et fruitée', 9.50, 5.80, 15),
('Westmalle Dubbel', 'Dubbel trappiste brune aux notes de caramel', 7.00, 4.90, 15),

-- Brasserie La Pleine Lune (id=16)
('Pleine Lune Blonde', 'Blonde alsacienne légère aux arômes floraux', 5.20, 3.60, 16),
('Pleine Lune Blanche', 'Blanche épicée à la coriandre et zeste d''orange', 4.80, 3.40, 16),

-- Brasserie Sainte Cru (id=17)
('Sainte Cru Blonde', 'Blonde bordelaise légère et désaltérante', 5.00, 3.50, 17),
('Sainte Cru IPA', 'IPA aux notes de pin et d''agrumes', 6.50, 4.30, 17),

-- Brasserie du Vieux Singe (id=18)
('Vieux Singe Ambrée', 'Ambrée marseillaise aux notes de miel et caramel', 5.80, 3.70, 18),
('Vieux Singe Porter', 'Porter robuste aux arômes de café et chocolat', 6.00, 4.20, 18),

-- Brasserie Mélusine (id=19)
('Mélusine Blonde', 'Blonde vendéenne légère et fruitée', 5.00, 3.40, 19),
('Mélusine Ambrée', 'Ambrée maltée aux notes biscuitées', 5.50, 3.60, 19),
('Mélusine Brune', 'Brune douce aux arômes de chocolat au lait', 5.80, 3.80, 19),

-- Brasserie Sulauze (id=20)
('Sulauze Blonde Bio', 'Blonde biologique légère et aromatique', 5.20, 4.00, 20),
('Sulauze IPA Bio', 'IPA biologique aux notes tropicales', 6.00, 4.50, 20),
('Sulauze Saison Bio', 'Saison biologique épicée et sèche', 6.50, 4.80, 20);

-- ------------------------------------------------------------
-- BEER_CATEGORY
-- ------------------------------------------------------------
INSERT INTO beer_category (beer_id, category_id) VALUES
    (1, 3), (2, 1), (3, 5),
    (4, 3), (5, 1), (6, 2),
    (7, 3), (8, 3), (9, 2),
    (10, 7), (11, 3), (12, 4),
    (13, 3), (14, 6),
    (15, 8), (16, 8),
    (17, 3), (18, 6),
    (19, 1), (20, 6), (21, 4),
    (22, 2), (23, 5),
    (24, 3), (25, 6),
    (26, 1), (27, 10),
    (28, 2), (29, 1),
    (30, 4), (31, 6), (32, 3),
    (33, 3),
    (34, 3), (35, 4),
    (36, 3), (37, 5),
    (38, 3), (39, 1),
    (40, 6), (41, 9),
    (42, 3), (43, 6), (44, 4),
    (45, 3), (46, 1), (47, 7);

-- ------------------------------------------------------------
-- BEER_INGREDIENT (sélection représentative)
-- ------------------------------------------------------------
INSERT INTO beer_ingredient (beer_id, ingredient_id) VALUES
    (1, 1), (1, 4), (1, 5), (1, 14),
    (2, 1), (2, 2), (2, 3), (2, 5), (2, 14),
    (3, 1), (3, 7), (3, 9), (3, 10), (3, 5), (3, 14),
    (6, 1), (6, 8), (6, 11), (6, 12), (6, 5), (6, 14),
    (10, 1), (10, 4), (10, 9), (10, 5), (10, 14),
    (15, 1), (15, 4), (15, 6), (15, 14),
    (22, 1), (22, 7), (22, 11), (22, 5), (22, 14),
    (26, 1), (26, 2), (26, 3), (26, 5), (26, 14),
    (41, 1), (41, 8), (41, 11), (41, 12), (41, 5), (41, 14),
    (47, 1), (47, 4), (47, 9), (47, 13), (47, 5), (47, 14);

-- ------------------------------------------------------------
-- USER_BEER_REVIEW
-- ------------------------------------------------------------
INSERT INTO user_beer_review (comment, rating, app_user_id, beer_id) VALUES
    ('Excellente IPA, très aromatique !', 5, 1, 2),
    ('Bonne blonde, légère et rafraîchissante', 4, 1, 1),
    ('Un peu trop amère à mon goût', 3, 2, 2),
    ('La meilleure saison que j''ai goûtée', 5, 2, 10),
    ('Très bonne blanche, épicée juste comme il faut', 4, 3, 3),
    ('Stout crémeux, parfait en hiver', 5, 3, 6),
    ('Bonne session IPA, peu alcoolisée', 4, 4, 29),
    ('La Gueuze est incroyable, très complexe', 5, 4, 15),
    ('L''Orval est unique, j''adore les notes Brett', 5, 5, 33),
    ('Chimay Bleue, une valeur sûre', 5, 5, 30),
    ('Très bonne ambrée, notes de caramel prononcées', 4, 6, 20),
    ('Porter bien équilibré', 4, 6, 41),
    ('IPA bio aux arômes tropicaux surprenants', 4, 7, 46),
    ('Blonde bio légère, idéale pour l''été', 4, 7, 45),
    ('Westmalle Tripel, une merveille belge', 5, 8, 34),
    ('La Telenn Du est originale avec le blé noir', 4, 8, 22),
    ('Saison bio très sèche et épicée', 3, 9, 47),
    ('Bonne sour, bien acidulée', 4, 9, 27),
    ('Ninkasi Pale Ale très fruitée', 4, 10, 19),
    ('Gallia Stout excellent', 5, 10, 6);

-- ------------------------------------------------------------
-- USER_BREWERY_REVIEW
-- ------------------------------------------------------------
INSERT INTO user_brewery_review (comment, rating, app_user_id, brewery_id) VALUES
    ('Brasserie incontournable à Bruxelles', 5, 1, 6),
    ('Cantillon, une institution ! Visite obligatoire', 5, 2, 6),
    ('Très bonne brasserie parisienne', 4, 3, 2),
    ('Dupont fait des saisons exceptionnelles', 5, 4, 4),
    ('Orval, cadre magnifique et bière unique', 5, 5, 14),
    ('Chimay propose des trappistes de grande qualité', 5, 6, 13),
    ('Brasserie du Mont Blanc, belle gamme de bières', 4, 7, 1),
    ('Ninkasi est une référence lyonnaise', 4, 8, 8),
    ('La Débauche fait des bières audacieuses', 4, 9, 11),
    ('Brasserie Sulauze, bravo pour le bio !', 5, 10, 20);

-- ------------------------------------------------------------
-- USER_BEER_FAVORITE
-- ------------------------------------------------------------
INSERT INTO user_beer_favorite (app_user_id, beer_id) VALUES
    (1, 2), (1, 15), (1, 33),
    (2, 10), (2, 30), (2, 34),
    (3, 3), (3, 6), (3, 22),
    (4, 15), (4, 29),
    (5, 33), (5, 34), (5, 35),
    (6, 41), (6, 20),
    (7, 45), (7, 46),
    (8, 22), (8, 34),
    (9, 27), (9, 47),
    (10, 19), (10, 6);

-- ------------------------------------------------------------
-- USER_BREWERY_FAVORITE
-- ------------------------------------------------------------
INSERT INTO user_brewery_favorite (app_user_id, brewery_id) VALUES
    (1, 6), (1, 3),
    (2, 4), (2, 13),
    (3, 2), (3, 8),
    (4, 6), (4, 14),
    (5, 13), (5, 14), (5, 15),
    (6, 8), (6, 11),
    (7, 20),
    (8, 15), (8, 9),
    (9, 11),
    (10, 2), (10, 8);
