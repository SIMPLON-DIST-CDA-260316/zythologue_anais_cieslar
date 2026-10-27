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
│   ├── register.tsx      (page d'inscription)
│   ├── dashboard.tsx     (layout protégé : sidebar + header + <Outlet />)
│   └── beers.tsx         (liste des bières + création + suppression)
├── components/
│   ├── login-form.tsx    (formulaire de connexion)
│   ├── register-form.tsx (formulaire d'inscription)
│   ├── beer-form-dialog.tsx (fenêtre + formulaire de création d'une bière)
│   ├── app-sidebar.tsx   (assemblage de la sidebar + menu)
│   ├── nav-main.tsx      (entrées du menu : lien direct ou sous-menu)
│   ├── nav-user.tsx      (bloc utilisateur + « Log out »)
│   └── ui/               (composants shadcn/ui)
├── hooks/
│   └── use-mobile.ts     (détection écran mobile, utilisé par la sidebar)
└── lib/
    ├── validations.ts    (schémas Zod : connexion, inscription, bière)
    └── utils.ts
```

## Routes

| Chemin             | Page            | Description                                        |
|--------------------|-----------------|----------------------------------------------------|
| `/login`           | `LoginPage`     | Formulaire de connexion                            |
| `/register`        | `RegisterPage`  | Formulaire d'inscription                           |
| `/dashboard`       | `DashboardPage` | 🔒 Layout (sidebar + header), contenu vide         |
| `/dashboard/beers` | `BeersPage`     | 🔒 Liste, création et suppression des bières       |
| `*`                | —               | Redirection vers `/login`                          |

Les routes sont imbriquées : `ProtectedRoute` → `DashboardPage` → `BeersPage`. Chaque parent affiche son enfant via `<Outlet />`, ce qui permet d'ajouter une nouvelle section (ex : brasseries) sans dupliquer la sidebar.

## Parcours d'inscription

1. L'utilisateur remplit `RegisterForm`, validé avec `registerSchema` (Zod).
2. Le formulaire envoie `POST ${VITE_API_URL}/auth/register`.
3. En cas de succès, redirection vers `/login` avec un message de confirmation.

## Parcours de connexion

1. L'utilisateur saisit email + mot de passe dans `LoginForm`.
2. Les champs sont validés avec `loginSchema` (Zod) ; les erreurs s'affichent sous chaque champ.
3. Si c'est valide, le formulaire envoie `POST ${VITE_API_URL}/auth/login`.
4. En cas d'erreur API, le `message` renvoyé est affiché ; si l'API est injoignable : « Impossible de contacter le serveur ».
5. En cas de succès, le formulaire appelle `login(token)` du contexte, puis redirige vers `/dashboard`.

## Authentification (`AuthContext`)

L'état de connexion est géré par un contexte React (`src/contexts/auth-context.tsx`), fourni à toute l'app par `AuthProvider` dans `main.tsx`.

Le contexte stocke le **token** dans un state et expose, via le hook `useAuth()` :

| Valeur          | Rôle                                                                      |
|-----------------|---------------------------------------------------------------------------|
| `token`         | le JWT (`string`) ou `null`, à envoyer dans le header `Authorization`     |
| `isAuth`        | `true` si l'utilisateur est connecté, calculé à partir de `token !== null` |
| `login(token)`  | stocke le token dans `localStorage` (clé `token`) et dans le state        |
| `logout()`      | supprime le token de `localStorage` et remet le state à `null`            |

Au chargement de l'app, le token est lu dans `localStorage` : un rechargement de page (F5) ne déconnecte donc pas l'utilisateur. Les composants n'accèdent jamais à `localStorage` directement, ils passent par `useAuth()`.

### Route protégée

Le composant `ProtectedRoute` (`App.tsx`) entoure les routes qui demandent une connexion. Il lit `isAuth` via `useAuth()` :
- connecté → affiche la page demandée (`<Outlet />`) ;
- non connecté → redirige vers `/login`.

`BeersPage` contient en plus sa propre garde (`if (!isAuth)`, placée après les hooks), par code défensif.

### Déconnexion

L'entrée « Log out » du menu utilisateur (`nav-user.tsx`) appelle `logout()`. Le changement de state provoque un nouveau rendu de `ProtectedRoute`, qui redirige vers `/login` sans rechargement de page ni `navigate` explicite.

> La protection côté front ne sert qu'à l'expérience utilisateur : un token peut être modifié dans `localStorage`. La sécurité réelle est assurée par l'API (middleware `authenticate`), qui vérifie le token à chaque requête protégée.

## Bières (`/dashboard/beers`)

### Liste

Au montage de la page, un `useEffect` (tableau de dépendances vide) appelle `GET /beers` (route publique) et range le résultat dans un state. Les bières sont affichées dans un tableau shadcn (`Table`) : id, nom, description, degré, prix, brasserie, ingrédients, catégories.

Le chargement est découpé en deux fonctions :
- `fetchBeers()` appelle l'API et **renvoie** les bières, sans toucher au state ;
- `refreshBeers()` appelle `fetchBeers()` puis range le résultat avec `setBeers`.

Le `useEffect` fait `fetchBeers().then((data) => setBeers(data))`. Appeler directement dans l'effet une fonction qui contient un `setState` est refusé par la règle ESLint `react-hooks/set-state-in-effect` ; avec `.then()`, le `setState` a lieu dans un callback, à l'arrivée de la réponse.

### Création

Le bouton « Ajouter une bière », au-dessus du tableau, ouvre le composant `BeerFormDialog` (`components/beer-form-dialog.tsx`) :

1. À son montage, le composant charge la liste des brasseries (`GET /breweries`) pour remplir le `Select`.
2. Le formulaire demande nom, description, degré d'alcool, prix et brasserie. Il est validé avec `beerSchema` (Zod) ; les erreurs s'affichent sous chaque champ.
3. `FormData` renvoie toujours des chaînes : le schéma utilise `z.coerce.number()` pour `alcohol_deg`, `price` et `brewery_id`. Les valeurs converties (`result.data`) sont envoyées à l'API.
4. `POST /beers` avec les headers `Content-Type: application/json` et `Authorization: Bearer <token>`.
5. Succès → la fenêtre se ferme (`open` est un state : `<Dialog open={open} onOpenChange={setOpen}>`), puis le composant appelle la prop `onSuccess`.
6. Échec → le `message` de l'API s'affiche dans la fenêtre ; si l'API est injoignable : « Impossible de contacter le serveur ».

`BeersPage` passe `onSuccess={refreshBeers}` : la liste est rechargée depuis l'API. On n'ajoute pas directement la réponse du `POST` au state, car elle n'a pas le même format que `GET /beers` (`id`, `name`, `brewery_id` au lieu de `beer_id`, `beer_name`, `brewery_name`).

Le `Select` (Base UI) reçoit `name="brewery_id"`, pour que sa valeur soit présente dans `FormData`, et `items` (liste `{ label, value }`), pour afficher le nom de la brasserie choisie plutôt que son id.

### Suppression

1. Le bouton 🗑️ de chaque ligne ouvre une fenêtre de confirmation (`AlertDialog`) qui affiche le nom de la bière.
2. « Supprimer » appelle `handleDelete(id)` : `DELETE /beers/:id` avec le header `Authorization: Bearer <token>`.
3. Succès → la bière est retirée du state avec `.filter()` (pas de rechargement de la liste).
4. Échec → le message s'affiche dans la fenêtre. Un `403` (bière créée par quelqu'un d'autre) est traduit en « Vous ne pouvez supprimer que les bières que vous avez créées. ».
5. L'erreur est remise à `null` à chaque ouverture/fermeture de fenêtre (`onOpenChange`), pour qu'un message ne s'affiche pas sur une autre bière.

> Les bières du seed n'ont pas de propriétaire (`created_by` vide) : leur suppression renvoie toujours `403`. Pour tester une suppression réussie, créer d'abord une bière avec son propre token.

## Limites actuelles / à faire

- La validité du token (signature, expiration à 7 jours) n'est pas vérifiée côté front : un token expiré laisse accéder au dashboard jusqu'au premier appel API, qui renverra `401`. Piste : une route `GET /auth/me` appelée par le contexte au démarrage.
- Le front ne sait pas quelles bières appartiennent à l'utilisateur (`GET /beers` ne renvoie pas `created_by`, le contexte ne connaît pas l'id de l'utilisateur) : le bouton de suppression est affiché sur toutes les lignes.
- Le menu utilisateur affiche des données en dur (« Mon compte ») : le nom et l'email ne sont pas encore récupérés.
- `/dashboard` seul affiche un contenu vide (pas de route index).
- Modification de bières pas encore faite. Piste : réutiliser `BeerFormDialog` avec une bière optionnelle en prop (pré-remplissage + `PATCH /beers/:id`).
- La bière créée n'a ni ingrédients, ni catégories, ni photos : le formulaire ne gère que les 5 champs acceptés par `POST /beers`.
