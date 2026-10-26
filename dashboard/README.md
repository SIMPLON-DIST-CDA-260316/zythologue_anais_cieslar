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
├── main.tsx              (point d'entrée, BrowserRouter + AuthProvider)
├── App.tsx               (déclaration des routes + ProtectedRoute)
├── contexts/
│   └── auth-context.tsx  (AuthProvider + hook useAuth)
├── pages/
│   ├── login.tsx         (page de connexion)
│   └── dashboard.tsx     (page protégée, bouton de déconnexion)
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
| `/dashboard` | `DashboardPage` | 🔒 Page protégée (connexion requise)          |
| `*`          | —               | Redirection vers `/login`                     |

## Parcours de connexion

1. L'utilisateur saisit email + mot de passe dans `LoginForm`.
2. Les champs sont validés avec `loginSchema` (Zod) ; les erreurs s'affichent sous chaque champ.
3. Si c'est valide, le formulaire envoie `POST ${VITE_API_URL}/auth/login`.
4. En cas d'erreur API, le `message` renvoyé est affiché ; si l'API est injoignable : « Impossible de contacter le serveur ».
5. En cas de succès, le formulaire appelle `login(token)` du contexte, puis redirige vers `/dashboard`.

## Authentification (`AuthContext`)

L'état de connexion est géré par un contexte React (`src/contexts/auth-context.tsx`), fourni à toute l'app par `AuthProvider` dans `main.tsx`.

Le contexte expose, via le hook `useAuth()` :

| Valeur          | Rôle                                                                 |
|-----------------|----------------------------------------------------------------------|
| `authenticated` | `true` si l'utilisateur est connecté                                 |
| `login(token)`  | stocke le token dans `localStorage` (clé `token`) et passe à `true`  |
| `logout()`      | supprime le token de `localStorage` et passe à `false`               |

Au chargement de l'app, `authenticated` est initialisé à partir de `localStorage` : un rechargement de page (F5) ne déconnecte donc pas l'utilisateur.

### Route protégée

Le composant `ProtectedRoute` (`App.tsx`) entoure les routes qui demandent une connexion. Il lit `authenticated` via `useAuth()` :
- connecté → affiche la page demandée (`<Outlet />`) ;
- non connecté → redirige vers `/login`.

### Déconnexion

Le bouton « Logout » du dashboard appelle `logout()`. Le changement de state provoque un nouveau rendu de `ProtectedRoute`, qui redirige vers `/login` sans rechargement de page ni `navigate` explicite.

> La protection côté front ne sert qu'à l'expérience utilisateur : un token peut être modifié dans `localStorage`. La sécurité réelle est assurée par l'API (middleware `authenticate`), qui vérifie le token à chaque requête protégée.

## Limites actuelles / à faire

- La validité du token (signature, expiration à 7 jours) n'est pas vérifiée côté front : un token expiré laisse accéder au dashboard jusqu'au premier appel API, qui renverra `401`.
- Le token n'est pas encore envoyé à l'API (header `Authorization: Bearer <token>`) : aucune donnée n'est affichée sur le dashboard pour l'instant.
- Pas de page d'inscription (l'inscription se fait via `POST /auth/register` sur l'API).
