## Dictionnaire de données
 
### user
 
| Champ      | Type         | Description                | Contraintes            |
|------------|--------------|----------------------------|------------------------|
| id         | SERIAL       | Identifiant unique         | PRIMARY KEY            |
| last_name  | VARCHAR(100) | Nom de l'utilisateur       | NOT NULL               |
| first_name | VARCHAR(100) | Prénom de l'utilisateur    | NOT NULL               |
| email      | VARCHAR(255) | Adresse email              | UNIQUE, NOT NULL       |
| password   | VARCHAR(255) | Mot de passe hashé         | NOT NULL               |
| created_at | TIMESTAMPTZ  | Date de création du compte | NOT NULL DEFAULT NOW() |
 
### brewery
 
| Champ   | Type          | Description             | Contraintes  |
|---------|---------------|-------------------------|--------------|
| id      | SERIAL        | Identifiant unique      | PRIMARY KEY  |
| name    | VARCHAR(255)  | Nom de la brasserie     | NOT NULL     |
| address | TEXT          | Adresse de la brasserie |              |
 
### beer
 
| Champ       | Type         | Description             | Contraintes                               |
|-------------|--------------|-------------------------|-------------------------------------------|
| id          | SERIAL       | Identifiant unique      | PRIMARY KEY                               |
| name        | VARCHAR(255) | Nom de la bière         | NOT NULL                                  |
| description | TEXT         | Description de la bière |                                           |
| alcohol_deg | NUMERIC      | Taux d'alcool (% vol.)  |                                           |
| price       | NUMERIC      | Prix en euros           |                                           |
| brewery_id  | INTEGER      | Brasserie productrice   | REFERENCES brewery(id) ON DELETE RESTRICT |
 
### category
 
| Champ | Type         | Description                          | Contraintes      |
|-------|--------------|--------------------------------------|------------------|
| id    | SERIAL       | Identifiant unique                   | PRIMARY KEY      |
| name  | VARCHAR(100) | Nom de la catégorie (ex: IPA, Stout) | UNIQUE, NOT NULL |
 
### ingredient
 
| Champ | Type         | Description           | Contraintes      |
|-------|--------------|-----------------------|------------------|
| id    | SERIAL       | Identifiant unique    | PRIMARY KEY      |
| name  | VARCHAR(255) | Nom de l'ingrédient   | UNIQUE, NOT NULL |
 
### photo
 
| Champ      | Type    | Description                          | Contraintes          |
|------------|---------|--------------------------------------|----------------------|
| id         | SERIAL  | Identifiant unique                   | PRIMARY KEY          |
| url        | TEXT    | URL de la photo                      | NOT NULL             |
 
### user-beer-review
 
| Champ      | Type        | Description                     | Contraintes                              |
|------------|-------------|---------------------------------|------------------------------------------|
| id         | SERIAL      | Identifiant unique              | PRIMARY KEY                              |
| comment    | TEXT        | Texte de l'avis                 |                                          |
| rating     | SMALLINT    | Note entre 1 et 5               | NOT NULL, CHECK (rating BETWEEN 1 AND 5) |
| created_at | TIMESTAMPTZ | Date de l'avis                  | NOT NULL DEFAULT NOW()                   |
| user_id    | INTEGER     | Auteur de l'avis                | REFERENCES user(id) ON DELETE CASCADE    |
| beer_id    | INTEGER     | Bière concernée (si applicable) | REFERENCES beer(id) ON DELETE CASCADE    |

### user-brewery-review

| Champ      | Type        | Description                         | Contraintes                               |
|------------|-------------|-------------------------------------|-------------------------------------------|
| id         | SERIAL      | Identifiant unique                  | PRIMARY KEY                               |
| comment    | TEXT        | Texte de l'avis                     |                                           |
| rating     | SMALLINT    | Note entre 1 et 5                   | NOT NULL, CHECK (rating BETWEEN 1 AND 5)  |
| created_at | TIMESTAMPTZ | Date de l'avis                      | NOT NULL DEFAULT NOW()                    |
| user_id    | INTEGER     | Auteur de l'avis                    | REFERENCES user(id)  ON DELETE CASCADE    |
| brewery_id | INTEGER     | Brasserie concernée (si applicable) | REFERENCES brewery(id) ON DELETE RESTRICT |
