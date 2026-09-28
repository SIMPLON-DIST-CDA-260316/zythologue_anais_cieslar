# Zythologue

API REST + base PostgreSQL pour une application de découverte de bières artisanales.

![Visuel du projet](img/bier.png)

## Objectif

Ce dépôt contient :

- une modélisation de données (dictionnaire + règles de gestion),
- un schema SQL PostgreSQL,
- des données de test,
- une API REST en Node.js / Express,
- une configuration Docker Compose pour lancer l'API et PostgreSQL ensemble en local.

## Arborescence utile

```text
zythologue/
├── docker-compose.yml
├── package.json
├── api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.sample
│   ├── package.json
│   ├── README.md          (documentation détaillée des endpoints)
│   ├── uploads/           (photos uploadées, ignoré par git)
│   └── src/
│       ├── server.js
│       ├── controllers/
│       ├── repositories/
│       ├── routes/
│       ├── middlewares/   (ex: upload Multer)
│       ├── validation/    (schémas Zod)
│       └── database/
├── docs/
│   ├── dictionnaire_donnees.md
│   └── regles_gestion.md
└── sql/
    ├── 01_create_schema.sql
    ├── 02_seed.sql
    └── 03_queries.sql
```

## Prerequis

- Docker Desktop (ou Docker Engine) avec `docker compose`
- Node.js 24 (utile en local pour l'édition/lint, l'exécution se fait dans le conteneur)
- DBeaver (optionnel) pour inspecter la base directement

## Installation rapide

1. Cloner le projet puis se placer à la racine.
2. Créer le fichier d'environnement.
3. Démarrer les conteneurs.
4. Charger le schema puis les données.

```bash
cd /chemin/vers/zythologue
cp .env.example .env
docker compose up -d --build
```

L'API est alors disponible sur `http://localhost:3000` et Postgres sur `localhost:5432`.

## Commandes Docker (présentées et validées)

```bash
docker compose up -d
docker compose up -d --build
docker compose ps
docker compose stop
docker compose start
docker compose down
docker compose down -v
docker compose logs -f
docker compose logs -f api
```

Équivalent via `package.json` (npm/pnpm/yarn) :

```bash
npm run docker:up
npm run docker:build
npm run docker:ps
npm run docker:stop
npm run docker:start
npm run docker:down
npm run docker:down:volumes
npm run docker:logs
```

Note : `docker compose config` a été vérifié sur ce dépôt le 24/08/2026.

## Paramètres de connexion PostgreSQL

Valeurs par défaut (fichier `.env.example`) :

```text
Host (depuis un client externe type DBeaver) : localhost
Host (depuis le conteneur api)                : postgres
Port     : 5432
Database : zythologue
User     : zythologue
Password : zythologue
```

Si le port `5432` est déjà pris, modifier `POSTGRES_PORT` dans `.env`.

## Utilisation avec DBeaver

Créer une connexion PostgreSQL avec les valeurs de `.env` (host `localhost`), puis executer les scripts dans cet ordre :

1. `sql/01_create_schema.sql`
2. `sql/02_seed.sql`
3. `sql/03_queries.sql` (partiellement finalisé)

## Utilisation de l'API

Une fois les conteneurs démarrés, l'API est accessible sur `http://localhost:3000`.

```text
GET    /beers               → liste des bières (avec brasserie, ingrédients, catégories, photos)
GET    /beers/:id           → détail d'une bière
POST   /beers                → créer une bière (validation Zod)
PATCH  /beers/:id            → mettre à jour une bière (validation Zod)
DELETE /beers/:id            → supprimer une bière
POST   /beers/:id/photos     → uploader une ou plusieurs photos pour une bière (multipart/form-data)
```

Documentation détaillée de chaque endpoint (corps de requête, réponses, erreurs) : voir [`api/README.md`](api/README.md).

Le rechargement à chaud est actif en développement (`node --watch`) : toute modification dans `api/src/` est censée être prise en compte automatiquement. En pratique, sur Mac, le bind mount Docker rate parfois les évènements de changement de fichier — si le comportement observé ne correspond pas au code, faire `docker compose restart api` avant de chercher un bug ailleurs.

## Etat actuel du projet

- Le setup Docker (API + PostgreSQL) est reproductible et fonctionnel.
- Les étapes d'installation sont courtes et actionnables.
- Le chargement base + seed fonctionne.
- La connexion API ↔ PostgreSQL via le réseau Docker interne (`DB_HOST=postgres`) est en place.
- Le fichier de requêtes `sql/03_queries.sql` est à terminer pour couvrir tout le besoin fonctionnel.
- CRUD complet sur `beer` (create, read, update, delete), avec validation des données via Zod.
- Upload de photos pour les bières (Multer, stockage disque, exposition via `GET /beers`).
- Pas encore de CRUD ni d'upload de photos pour `brewery` (même pattern à répliquer plus tard).