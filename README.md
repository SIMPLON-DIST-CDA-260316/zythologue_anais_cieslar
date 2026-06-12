# Zythologue

Base PostgreSQL pour une application de découverte de bières artisanales.

![Visuel du projet](img/bier.png)

## Objectif

Ce dépôt contient :

- une modélisation de données (dictionnaire + règles de gestion),
- un schema SQL PostgreSQL,
- des données de test,
- une configuration Docker Compose pour lancer PostgreSQL localement.

## Arborescence utile

```text
zythologue/
├── docker-compose.yml
├── .env.example
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
- DBeaver pour executer/inspecter les requêtes SQL

## Installation rapide

1. Cloner le projet puis se placer à la racine.
2. Créer le fichier d'environnement.
3. Démarrer DBeaver.
4. Charger le schema puis les données.

```bash
cd /chemin/vers/zythologue
cp .env.example .env
docker compose up -d
```

## Commandes Docker (présentées et validées)

Les commandes ci-dessous sont disponibles directement via Docker Compose :

```bash
docker compose up -d
docker compose ps
docker compose stop
docker compose start
docker compose down
docker compose down -v
docker compose logs -f
docker compose config
```

Équivalent via `package.json` (npm/pnpm/yarn) :

```bash
npm run docker:up
npm run docker:ps
npm run docker:stop
npm run docker:start
npm run docker:down
npm run docker:down:volumes
npm run docker:logs
npm run docker:config
```

Note : `docker compose config` a été vérifié sur ce dépôt le 12/06/2026.

## Paramètres de connexion PostgreSQL

Valeurs par défaut (fichier `.env.example`) :

```text
Host: localhost
Port: 5432
Database: zythologue
User: zythologue
Password: zythologue
```

Si le port `5432` est déjà pris, modifier `POSTGRES_PORT` dans `.env`.


## Utilisation avec DBeaver

Créer une connexion PostgreSQL avec les valeurs de `.env`, puis executer les scripts dans cet ordre :

1. `sql/01_create_schema.sql`
2. `sql/02_seed.sql`
3. `sql/03_queries.sql` (partiellement finalisé)

## Etat actuel du projet

- Le setup Docker est simple et reproductible.
- Les étapes d'installation sont courtes et actionnables.
- Le chargement base + seed fonctionne.
- Le fichier de requêtes `sql/03_queries.sql` est à terminer pour couvrir tout le besoin fonctionnel.
