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
│   └── auth-context.tsx  (AuthProvider + hook useAuth, charge l'utilisateur via /auth/me)
├── pages/
│   ├── login.tsx         (page de connexion)
│   ├── register.tsx      (page d'inscription)
│   ├── dashboard.tsx     (layout protégé : sidebar + header + <Outlet />)
│   └── beers.tsx         (liste des bières + CRUD)
├── components/
│   ├── login-form.tsx    (formulaire de connexion)
│   ├── register-form.tsx (formulaire d'inscription)
│   ├── beer-form-dialog.tsx (fenêtre + formulaire de création/modification d'une bière)
│   ├── app-sidebar.tsx   (assemblage de la sidebar + menu)
│   ├── nav-main.tsx      (entrées du menu : lien direct ou sous-menu)
│   ├── nav-user.tsx      (initiales, prénom, email de l'utilisateur + « Log out »)
│   └── ui/               (composants shadcn/ui)
├── hooks/
│   └── use-mobile.ts     (détection écran mobile, utilisé par la sidebar)
└── lib/
    ├── validations.ts    (schémas Zod : connexion, inscription, bière)
    ├── types.ts          (types partagés : Beer, Brewery, User, AuthContextType)
    └── utils.ts
```

## Routes

| Chemin             | Page            | Description                                        |
|--------------------|-----------------|----------------------------------------------------|
| `/login`           | `LoginPage`     | Formulaire de connexion                            |
| `/register`        | `RegisterPage`  | Formulaire d'inscription                           |
| `/dashboard`       | `DashboardPage` | 🔒 Layout (sidebar + header), contenu vide         |
| `/dashboard/beers` | `BeersPage`     | 🔒 Liste et CRUD des bières                        |
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

Le contexte stocke le **token** et l'**utilisateur connecté** dans deux states, et expose, via le hook `useAuth()` :

| Valeur          | Rôle                                                                      |
|-----------------|---------------------------------------------------------------------------|
| `token`         | le JWT (`string`) ou `null`, à envoyer dans le header `Authorization`     |
| `isAuth`        | `true` si l'utilisateur est connecté, calculé à partir de `token !== null` |
| `user`          | `{ id, first_name, last_name, email }` renvoyé par `GET /auth/me`, ou `null` (pas connecté, ou réponse pas encore arrivée) |
| `login(token)`  | stocke le token dans `localStorage` (clé `token`) et dans le state        |
| `logout()`      | supprime le token de `localStorage` et remet `token` et `user` à `null`    |

Au chargement de l'app, le token est lu dans `localStorage` : un rechargement de page (F5) ne déconnecte donc pas l'utilisateur. Les composants n'accèdent jamais à `localStorage` directement, ils passent par `useAuth()`.

### Chargement de l'utilisateur (`GET /auth/me`)

Un `useEffect` du contexte, avec `[token]` comme dépendance, appelle `GET /auth/me` avec le header `Authorization: Bearer <token>` :

- au démarrage de l'app (token lu dans `localStorage`) ;
- après `login()` (nouveau token) : le nom s'affiche sans rechargement de page ;
- après `logout()`, le token vaut `null` : l'effet s'arrête tout de suite (`if (!token) return`).

Réponse :
- `200` → `setUser(data)` ;
- `401` (token expiré, modifié ou utilisateur supprimé) → `logout()`, puis `ProtectedRoute` redirige vers `/login`.

L'appel est écrit avec `.then()` plutôt qu'`async/await` : la fonction d'un `useEffect` ne peut pas être `async`, et un `setState` dans un callback respecte la règle ESLint `set-state-in-effect`. Pour la même raison, `user` est remis à `null` dans `logout()` et non dans l'effet.

Si l'API est injoignable (erreur réseau, pas de `401`), l'utilisateur n'est pas déconnecté : la sidebar n'affiche simplement pas son nom.

### Menu utilisateur

`nav-user.tsx` lit `user` via `useAuth()` (plus de prop ni de données en dur) et affiche les initiales (`first_name[0]` + `last_name[0]`) dans l'avatar, le prénom et l'email. Tant que `user` vaut `null`, l'optional chaining (`user?.first_name`) évite une erreur et rien ne s'affiche.

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

Le chargement des bières est découpé en deux fonctions :
- `fetchBeers()` appelle l'API et **renvoie** les bières, sans toucher au state ;
- `refreshBeers()` appelle `fetchBeers()` puis range le résultat avec `setBeers`.

Le `useEffect` fait `fetchBeers().then((data) => setBeers(data))`, et de la même façon charge les brasseries (`GET /breweries`) dans un state `breweries`. Appeler directement dans l'effet une fonction qui contient un `setState` est refusé par la règle ESLint `react-hooks/set-state-in-effect` ; avec `.then()`, le `setState` a lieu dans un callback, à l'arrivée de la réponse.

### Création

Le bouton « Ajouter une bière », au-dessus du tableau, ouvre le composant `BeerFormDialog` (`components/beer-form-dialog.tsx`) :

1. Le `Select` est rempli avec la prop `breweries`, chargée une seule fois par `BeersPage` (voir ci-dessous).
2. Le formulaire demande nom, description, degré d'alcool, prix et brasserie. Il est validé avec `beerSchema` (Zod) ; les erreurs s'affichent sous chaque champ.
3. `FormData` renvoie toujours des chaînes : le schéma utilise `z.coerce.number()` pour `alcohol_deg`, `price` et `brewery_id`. Les valeurs converties (`result.data`) sont envoyées à l'API.
4. `POST /beers` avec les headers `Content-Type: application/json` et `Authorization: Bearer <token>`.
5. Succès → la fenêtre se ferme (`open` est un state : `<Dialog open={open} onOpenChange={handleOpenChange}>`), puis le composant appelle la prop `onSuccess`.
6. Échec → le `message` de l'API s'affiche dans la fenêtre ; si l'API est injoignable : « Impossible de contacter le serveur ».

`BeersPage` passe `onSuccess={refreshBeers}` : la liste est rechargée depuis l'API. On n'ajoute pas directement la réponse du `POST` au state, car elle n'a pas le même format que `GET /beers` (`id`, `name`, `brewery_id` au lieu de `beer_id`, `beer_name`, `brewery_name`).

Le `Select` (Base UI) reçoit `name="brewery_id"`, pour que sa valeur soit présente dans `FormData`, et `items` (liste `{ label, value }`), pour afficher le nom de la brasserie choisie plutôt que son id.

`handleOpenChange` ouvre/ferme la fenêtre et remet `error` et `fieldErrors` à zéro, pour qu'un message ne réapparaisse pas à la réouverture.

**Pourquoi les brasseries sont chargées par `BeersPage` :** un `BeerFormDialog` est affiché pour le bouton « Ajouter » **et** sur chaque ligne du tableau (modification). Si chaque instance chargeait les brasseries dans son propre `useEffect`, la page ferait un appel `GET /breweries` par ligne. La page, parent commun, les charge une fois et les passe en prop (*lifting state up*).

### Modification

Le même composant `BeerFormDialog` sert à la modification : il reçoit une prop optionnelle `beer?: Beer`, et `const isEdit = beer !== undefined` détermine le mode.

| | Création (`beer` absent) | Modification (`beer` fourni) |
|---|---|---|
| Bouton d'ouverture | « Ajouter une bière », au-dessus du tableau | icône ✏️ (`PencilIcon`) sur chaque ligne |
| Titre | « Nouvelle bière » | « Modifier <nom> » |
| Champs | vides | pré-remplis avec `defaultValue={beer?.…}` (le `Select` reçoit `String(beer.brewery_id)`) |
| Requête | `POST /beers` | `PATCH /beers/:id` |
| Bouton | « Créer » | « Enregistrer » |

- `defaultValue` (et non `value`) donne une valeur de départ sans rendre le champ contrôlé : l'utilisateur peut le modifier et la valeur est lue avec `FormData`.
- Un `403` (bière créée par quelqu'un d'autre) est traduit en « Vous ne pouvez modifier que les bières que vous avez créées. ».
- En cas de succès, la liste est rechargée via `onSuccess={refreshBeers}` (la réponse du `PATCH` a, comme celle du `POST`, les noms de colonnes bruts).
- Le pré-remplissage de la brasserie nécessite `brewery_id`, ajouté pour cela à la réponse de `GET /beers` côté API.

Les types `Beer` et `Brewery` sont dans `lib/types.ts`, car ils sont utilisés à la fois par la page et par le composant.

### Suppression

1. Le bouton 🗑️ de chaque ligne ouvre une fenêtre de confirmation (`AlertDialog`) qui affiche le nom de la bière.
2. « Supprimer » appelle `handleDelete(id)` : `DELETE /beers/:id` avec le header `Authorization: Bearer <token>`.
3. Succès → la bière est retirée du state avec `.filter()` (pas de rechargement de la liste).
4. Échec → le message s'affiche dans la fenêtre. Un `403` (bière créée par quelqu'un d'autre) est traduit en « Vous ne pouvez supprimer que les bières que vous avez créées. ».
5. L'erreur est remise à `null` à chaque ouverture/fermeture de fenêtre (`onOpenChange`), pour qu'un message ne s'affiche pas sur une autre bière.

> Les bières du seed n'ont pas de propriétaire (`created_by` vide) : leur modification et leur suppression renvoient toujours `403`. Pour tester avec succès, créer d'abord une bière avec son propre compte.

## Limites actuelles / à faire

- Le front ne sait pas quelles bières appartiennent à l'utilisateur (`GET /beers` ne renvoie pas `created_by` ; l'id de l'utilisateur est en revanche disponible dans `user.id`) : les boutons de modification et de suppression sont affichés sur toutes les lignes.
- `/dashboard` seul affiche un contenu vide (pas de route index).
- Pendant le premier rendu, avant la réponse de `/auth/me`, un token invalide donne accès au dashboard une fraction de seconde avant la redirection.
- Le formulaire ne gère ni les ingrédients, ni les catégories, ni les photos : seulement les 5 champs acceptés par `POST /beers` et `PATCH /beers/:id`.
