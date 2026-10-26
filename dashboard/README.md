# Dashboard Zythologue

Front-end React du projet Zythologue, connecté à l'API (`../api`).

## Stack

- React 19 + TypeScript, bundlé avec Vite
- React Router (routing)
- Tailwind CSS 4 + composants [shadcn/ui](https://ui.shadcn.com) (`src/components/ui/`)
- Zod (validation des formulaires côté client)
- lucide-react (icônes)

## Lancer le dashboard

Avec Docker Compose, depuis la racine du projet (lance aussi l'API et PostgreSQL) :

```bash
docker compose up -d --build
```

Ou en local, depuis `dashboard/` :

```bash
npm install
VITE_API_URL=http://localhost:3000 npm run dev
```

Le dashboard est disponible sur `http://localhost:5173`. L'API autorise cette origine via CORS (`api/src/server.js`).

### Variables d'environnement

| Variable       | Rôle                         | Valeur par défaut (Docker) |
|----------------|------------------------------|----------------------------|
| `VITE_API_URL` | URL de base de l'API appelée | `http://localhost:3000`    |

### Scripts

```bash
npm run dev       # serveur de développement Vite
npm run build     # vérification TypeScript + build de production
npm run lint      # ESLint
npm run preview   # prévisualiser le build
```

## Arborescence

```text
src/
├── main.tsx              (point d'entrée, BrowserRouter)
├── App.tsx               (déclaration des routes)
├── pages/
│   ├── login.tsx         (page de connexion)
│   └── dashboard.tsx     (page après connexion)
├── components/
│   ├── login-form.tsx    (formulaire de connexion)
│   └── ui/               (composants shadcn/ui)
└── lib/
    ├── validations.ts    (schéma Zod du formulaire de connexion)
    └── utils.ts
```

## Routes

| Chemin       | Page            | Description                                   |
|--------------|-----------------|-----------------------------------------------|
| `/login`     | `LoginPage`     | Formulaire de connexion                       |
| `/dashboard` | `DashboardPage` | Page affichée après connexion                 |
| `*`          | —               | Redirection vers `/login`                     |

## Parcours de connexion

1. L'utilisateur saisit email + mot de passe dans `LoginForm`.
2. Les champs sont validés avec `loginSchema` (Zod) ; les erreurs s'affichent sous chaque champ.
3. Si c'est valide, le formulaire envoie `POST ${VITE_API_URL}/auth/login`.
4. En cas d'erreur API, le `message` renvoyé est affiché ; si l'API est injoignable : « Impossible de contacter le serveur ».
5. En cas de succès, le token JWT est stocké dans `localStorage` (clé `token`) puis l'utilisateur est redirigé vers `/dashboard`.

## Limites actuelles / à faire

- `/dashboard` n'est pas protégée : on peut y accéder sans token. Il faudra une route protégée qui redirige vers `/login` si aucun token valide n'est présent.
- Pas encore de déconnexion (suppression du token).
- Le token n'est pas encore envoyé à l'API (header `Authorization: Bearer <token>`) : aucune donnée n'est affichée sur le dashboard pour l'instant.
- Pas de page d'inscription (l'inscription se fait via `POST /auth/register` sur l'API).
