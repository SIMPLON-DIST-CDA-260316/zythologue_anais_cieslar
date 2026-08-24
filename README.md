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
├── Dockerfile
├── .dockerignore
├── .env.example
├── package.json
├── src/
│   ├── server.js
│   ├── controllers/
│   ├── repositories/
│   └── ...
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
GET /beers        → liste des bières
GET /beers/:id    → détail d'une bière
```

Le rechargement à chaud est actif en développement : toute modification dans `src/` est prise en compte automatiquement.

## Etat actuel du projet

- Le setup Docker (API + PostgreSQL) est reproductible et fonctionnel.
- Les étapes d'installation sont courtes et actionnables.
- Le chargement base + seed fonctionne.
- La connexion API ↔ PostgreSQL via le réseau Docker interne (`DB_HOST=postgres`) est en place.
- Le fichier de requêtes `sql/03_queries.sql` est à terminer pour couvrir tout le besoin fonctionnel.