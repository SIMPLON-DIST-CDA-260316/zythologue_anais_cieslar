# Zythologue

API REST + base PostgreSQL + dashboard React pour une application de découverte de bières artisanales.

![Visuel du projet](img/bier.png)

## Objectif

Ce dépôt contient :

- une modélisation de données (dictionnaire + règles de gestion),
- un schema SQL PostgreSQL,
- des données de test,
- une API REST en Node.js / Express, sécurisée par comptes utilisateurs (argon2 + JWT),
- un dashboard React / TypeScript / Vite (inscription, connexion, dashboard protégé avec CRUD des bières),
- des diagrammes de séquence UML du parcours d'authentification,
- une configuration Docker Compose pour lancer PostgreSQL, l'API et le dashboard ensemble en local.

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
│       ├── controllers/   (beerController, userController)
│       ├── repositories/
│       ├── routes/        (beerRoutes, authRoutes)
│       ├── middlewares/   (upload Multer, authenticate JWT)
│       ├── validation/    (schémas Zod)
│       └── database/
├── dashboard/
│   ├── Dockerfile
│   ├── README.md          (documentation du front)
│   └── src/
│       ├── App.tsx        (routes React Router)
│       ├── contexts/      (AuthContext : token + login/logout)
│       ├── pages/         (login, register, dashboard, beers)
│       ├── components/    (formulaires, sidebar + composants shadcn/ui)
│       └── lib/           (validations Zod, types partagés)
├── docs/
│   ├── dictionnaire_donnees.md
│   ├── regles_gestion.md
│   └── diagrames sequences/
│       ├── diagram-enregistrement.png
│       ├── diagram-login.png
│       └── diagram-authorization.png
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
# renseigner JWT_SECRET dans .env (obligatoire pour signer les tokens)
docker compose up -d --build
```

L'API est alors disponible sur `http://localhost:3000`, le dashboard sur `http://localhost:5173` et Postgres sur `localhost:5432`.

`JWT_SECRET` est vide dans `.env.example` : sans valeur, la connexion (`POST /auth/login`) échoue. Mettre une chaîne longue et aléatoire, par exemple générée avec :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

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
POST   /auth/register        → créer un compte (mot de passe hashé avec argon2)
POST   /auth/login           → se connecter, renvoie un token JWT (valable 7 jours)
GET    /auth/me              → 🔒 utilisateur connecté (id, prénom, nom, email)

GET    /beers                → liste des bières (avec brasserie, ingrédients, catégories, photos)
GET    /beers/:id            → détail d'une bière
POST   /beers                → 🔒 créer une bière (validation Zod)
PATCH  /beers/:id            → 🔒 mettre à jour une bière (créateur uniquement)
DELETE /beers/:id            → 🔒 supprimer une bière (créateur uniquement)
POST   /beers/:id/photos     → 🔒 uploader des photos (créateur uniquement, multipart/form-data)

GET    /breweries            → liste des brasseries (id, nom), triée par nom
```

🔒 = route protégée : envoyer le header `Authorization: Bearer <token>`. Le middleware `authenticate` vérifie le token puis place l'utilisateur dans `req.user`. Les modifications ne sont autorisées qu'au créateur de la bière (`beer.created_by === req.user.id`), sinon `403 Forbidden`.

Les diagrammes de séquence (enregistrement, connexion, autorisation) sont dans [`docs/diagrames sequences/`](docs/diagrames%20sequences/).

Documentation détaillée de chaque endpoint (corps de requête, réponses, erreurs) : voir [`api/README.md`](api/README.md).

Le rechargement à chaud est actif en développement (`node --watch`) : toute modification dans `api/src/` est censée être prise en compte automatiquement. En pratique, sur Mac, le bind mount Docker rate parfois les évènements de changement de fichier — si le comportement observé ne correspond pas au code, faire `docker compose restart api` avant de chercher un bug ailleurs.

## Dashboard

Application React (Vite + TypeScript + Tailwind + shadcn/ui) lancée par Docker Compose sur `http://localhost:5173`. L'URL de l'API lui est passée via `VITE_API_URL`. Détails : voir [`dashboard/README.md`](dashboard/README.md).

## Etat actuel du projet

- Le setup Docker (API + PostgreSQL) est reproductible et fonctionnel.
- Les étapes d'installation sont courtes et actionnables.
- Le chargement base + seed fonctionne.
- La connexion API ↔ PostgreSQL via le réseau Docker interne (`DB_HOST=postgres`) est en place.
- Le fichier de requêtes `sql/03_queries.sql` est à terminer pour couvrir tout le besoin fonctionnel.
- CRUD complet sur `beer` (create, read, update, delete), avec validation des données via Zod.
- Upload de photos pour les bières (Multer, stockage disque, exposition via `GET /beers`).
- `brewery` : seule la liste (`GET /breweries`) existe, pour le formulaire de bière du dashboard. Pas encore de CRUD ni d'upload de photos.
- Authentification en place : inscription (argon2), connexion (JWT), routes d'écriture protégées et vérification du propriétaire (`created_by`).
- Diagrammes de séquence UML réalisés pour l'enregistrement, la connexion et l'autorisation.
- Dashboard : inscription et connexion (validation Zod), état de connexion géré par un contexte React (`AuthContext`) qui charge l'utilisateur connecté via `GET /auth/me` et déconnecte si le token est invalide, routes protégées, layout avec sidebar shadcn, et CRUD complet des bières (tableau, création et modification dans une fenêtre, suppression avec confirmation).