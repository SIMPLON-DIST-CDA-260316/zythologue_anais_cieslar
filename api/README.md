# API Documentation

## Authentication

Les routes d'écriture sur les bières sont protégées. Le parcours est le suivant :

1. `POST /auth/register` crée un compte (mot de passe hashé avec argon2).
2. `POST /auth/login` vérifie les identifiants et renvoie un token JWT (payload `{ userId }`, signé avec `JWT_SECRET`, valable 7 jours).
3. Le client envoie ce token sur chaque route protégée (dont `GET /auth/me`, qui renvoie l'utilisateur connecté) :

```http
Authorization: Bearer <token>
```

Le middleware `authenticate` (`src/middlewares/auth.js`) vérifie le token, retrouve l'utilisateur en base et le place dans `req.user`. Les contrôleurs comparent ensuite `beer.created_by` à `req.user.id` : seul le créateur d'une bière peut la modifier, la supprimer ou y ajouter des photos.

Diagrammes de séquence : voir [`docs/diagrames sequences/`](../docs/diagrames%20sequences/).

### Register

#### Endpoint

POST `/auth/register`

#### Description

Create a user account. The body is validated with Zod; the email is lowercased and the password is hashed with argon2 before being stored in `app_user`.

Password rules: 12 to 64 characters, at least one uppercase letter, one lowercase letter, one digit and one special character.

#### Request body

```json
{
  "last_name": "Dupont",
  "first_name": "Marie",
  "email": "marie.dupont@example.com",
  "password": "MotDePasse123!"
}
```

#### Response

##### Success response
###### Status: 201 Created

```json
{
  "last_name": "Dupont",
  "first_name": "Marie",
  "email": "marie.dupont@example.com",
  "created_at": "2026-10-07T09:12:45.123Z"
}
```

Le hash du mot de passe et l'id ne sont jamais renvoyés.

##### Error responses

###### Missing or invalid field

Status: **400 Bad Request**

```json
{
  "message": "password: Password must be at least 12 characters"
}
```

Autres messages possibles : `"last_name: Last name cannot be empty"`, `"first_name: First name cannot be empty"`, `"password: Password must contain an uppercase letter"` (idem pour minuscule, chiffre, caractère spécial), `"password: Password must be at most 64 characters"`, ou le message Zod pour un email invalide.

###### Email already used

Status: **409 Conflict**

```json
{
  "message": "User already exists"
}
```

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

### Login

#### Endpoint

POST `/auth/login`

#### Description

Check the credentials (argon2 verify) and return a signed JWT.

#### Request body

```json
{
  "email": "marie.dupont@example.com",
  "password": "MotDePasse123!"
}
```

#### Response

##### Success response
###### Status: 200 OK

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Error responses

###### Invalid field

Status: **400 Bad Request** — format Zod `"<champ>: <message>"` (email invalide, mot de passe vide ou > 64 caractères).

###### Wrong email or password

Status: **400 Bad Request**

```json
{
  "message": "Invalid email or password"
}
```

Le même message est renvoyé que l'email soit inconnu ou que le mot de passe soit faux, pour ne pas révéler quels emails ont un compte.

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

### Get the connected user 🔒

#### Endpoint

GET `/auth/me`

#### Description

Return the user who owns the token. The middleware `authenticate` has already checked the token and loaded the user into `req.user`: the controller `getMe` only sends it back (no extra database call, no `try/catch`).

Used by the dashboard at startup to get the user's name and email, and to check that the stored token is still valid (a `401` means the client must log out).

The password hash is never returned: `findUserById` selects only `id`, `first_name`, `last_name` and `email`.

#### Example request

```http
GET /auth/me
Authorization: Bearer <token>
```

#### Response

##### Success response
###### Status: 200 OK

```json
{
  "id": "3f2c9a1e-8b7d-4c5e-9f10-2a6b8d4e1c37",
  "first_name": "Marie",
  "last_name": "Dupont",
  "email": "marie.dupont@example.com"
}
```

##### Error responses

`401 Unauthorized` if the token is missing, invalid or expired: see *Errors common to protected routes* below.

### Errors common to protected routes

Ces erreurs peuvent être renvoyées par toutes les routes marquées 🔒 ci-dessous.

###### Missing token

Status: **401 Unauthorized** — header `Authorization` absent ou ne commençant pas par `Bearer `, ou utilisateur du token introuvable en base.

```json
{
  "message": "Authentication required"
}
```

###### Invalid or expired token

Status: **401 Unauthorized**

```json
{
  "message": "Invalid or expired token"
}
```

###### Not the owner of the beer

Status: **403 Forbidden** — l'utilisateur connecté n'est pas le créateur de la bière (`PATCH`, `DELETE`, `POST /photos`).

```json
{
  "message": "Forbidden"
}
```

## Beers

### Get all beers

#### Endpoint

GET `/beers`

#### Description

List all beers, with their brewery, ingredients, categories and photos.

#### Example request

```http
GET /beers
```

#### Response

##### Success response
###### Status: 200 OK

```json
[
  {
    "beer_id": 1,
    "beer_name": "Mont Blanc Blonde",
    "description": "Blonde légère et rafraîchissante aux arômes floraux",
    "alcohol_deg": "5.00",
    "price": "3.50",
    "brewery_name": "Brasserie du Mont Blanc",
    "brewery_id": 1,
    "ingredients": ["Malt d'orge", "Houblon Saaz", "Levure ale", "Eau"],
    "categories": ["Blonde"],
    "photos": ["/uploads/beers/956b400c-76c1-4508-b8fd-8eedf756fdf5.jpg"]
  }
]
```

Note : `ingredients`, `categories` et `photos` valent `null` (pas un tableau vide) quand une bière n'en a aucun.

### Get one beer

#### Endpoint

GET `/beers/:id`

#### Description

Find a beer by its id, with its brewery, ingredients, categories and photos.

#### Example request

```http
GET /beers/1
```

#### Response

##### Success response
###### Status: 200 OK

```json
{
  "beer_id": 1,
  "beer_name": "Mont Blanc Blonde",
  "description": "Blonde légère et rafraîchissante aux arômes floraux",
  "alcohol_deg": "5.00",
  "price": "3.50",
  "brewery_name": "Brasserie du Mont Blanc",
  "created_by": "3f2c9a1e-8b7d-4c5e-9f10-2a6b8d4e1c37",
  "brewery_id": 1,
  "ingredients": ["Malt d'orge", "Houblon Saaz", "Levure ale", "Eau"],
  "categories": ["Blonde"],
  "photos": ["/uploads/beers/956b400c-76c1-4508-b8fd-8eedf756fdf5.jpg"]
}
```

##### Error responses

###### Invalid id type
###### Status: 400 Bad Request

```json
{
  "message": "Invalid beer id"
}
```

###### Beer not found
###### Status: 404 Not Found

```json
{
  "message": "Beer not Found"
}
```

### Create one beer 🔒

#### Endpoint

POST `/beers`

#### Description

Create a new beer. Requires a valid token. The request body is validated with Zod before reaching the database, and `brewery_id` must reference an existing brewery. The connected user (`req.user.id`) is saved as the beer's creator (`created_by`).

#### Request body

```json
{
  "name": "IPA Test",
  "description": "Une IPA de test",
  "alcohol_deg": 6.5,
  "price": 4.5,
  "brewery_id": 1
}
```

#### Response

##### Success response
###### Status: 201 Created

```json
{
  "id": 44,
  "name": "IPA Test",
  "description": "Une IPA de test",
  "alcohol_deg": "6.50",
  "price": "4.50",
  "brewery_id": 1,
  "created_by": "3f2c9a1e-8b7d-4c5e-9f10-2a6b8d4e1c37"
}
```

Note : la réponse de création renvoie les noms de colonnes bruts de la table `beer` (`id`, `name`, `brewery_id`...), différents de ceux renvoyés par `GET /beers`/`GET /beers/:id` (`beer_id`, `beer_name`, `brewery_name`...). C'est une incohérence connue, pas corrigée pour l'instant.

##### Error responses

En plus des erreurs `401` / `403` communes aux routes protégées (voir [plus haut](#errors-common-to-protected-routes)) :

Les erreurs de validation sont générées par Zod, au format `"<champ>: <message>"`.

###### Missing or invalid field

Status: **400 Bad Request**

```json
{
  "message": "name: Name cannot be empty"
}
```

Autres messages possibles selon le champ en cause : `"alcohol_deg: Alcohol degree must be a positive number"`, `"price: Price must be a positive number"`, `"brewery_id: A valid brewery_id is required"`, ou le message générique de Zod pour un champ manquant (ex: `"alcohol_deg: Invalid input: expected number, received undefined"`).

###### Brewery not found

Status: **404 Not Found**

```json
{
  "message": "Brewery not found"
}
```

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

### Update one beer 🔒

#### Endpoint

PATCH `/beers/:id`

#### Description

Update one or more fields of an existing beer. All fields are optional, but at least one must be provided. If `brewery_id` is provided, it must reference an existing brewery. Only the creator of the beer can update it.

#### Request body

```json
{
  "price": 4.50
}
```

#### Response

##### Success response
###### Status: 200 OK

```json
{
  "id": 1,
  "name": "Mont Blanc Blanche",
  "description": "White beer",
  "alcohol_deg": "4.80",
  "price": "3.80",
  "brewery_id": 1,
  "created_by": "3f2c9a1e-8b7d-4c5e-9f10-2a6b8d4e1c37"
}
```

##### Error responses

En plus des erreurs `401` / `403` communes aux routes protégées (voir [plus haut](#errors-common-to-protected-routes)) :

###### Invalid beer id

Status: **400 Bad Request**

```json
{
  "message": "Invalid beer id"
}
```

###### Request body cannot be empty

Status: **400 Bad Request**

```json
{
  "message": "No fields to update"
}
```

###### Invalid field

Status: **400 Bad Request** — même format que pour la création (`"<champ>: <message>"`), voir plus haut.

```json
{
  "message": "price: Price must be a positive number"
}
```

###### Brewery not found

Status: **404 Not Found**

```json
{
  "message": "Brewery not found"
}
```

###### Beer not found

Status: **404 Not Found**

```json
{
  "message": "Beer not found"
}
```

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

### Add photos to a beer 🔒

#### Endpoint

POST `/beers/:id/photos`

#### Description

Upload one or more photos for an existing beer. Only the creator of the beer can add photos. The request must be sent as `multipart/form-data`, with each file under the field name `photos` (repeat the field to send several files in one request).

Accepted file types: `image/jpeg`, `image/png`, `image/webp`. Maximum size: 5 MB per file. No limit on the number of files.

#### Example request

```http
POST /beers/1/photos
Authorization: Bearer <token>
Content-Type: multipart/form-data

photos: <file1.jpg>
photos: <file2.png>
```

#### Response

##### Success response
###### Status: 201 Created

```json
[
  { "id": 12, "url": "/uploads/beers/956b400c-76c1-4508-b8fd-8eedf756fdf5.jpg" },
  { "id": 13, "url": "/uploads/beers/1a2b3c4d-....png" }
]
```

Les fichiers sont servis statiquement : l'URL renvoyée est directement utilisable, préfixée par l'adresse de l'API (ex: `http://localhost:3000/uploads/beers/....jpg`).

##### Error responses

En plus des erreurs `401` / `403` communes aux routes protégées (voir [plus haut](#errors-common-to-protected-routes)) :

###### Invalid beer id

Status: **400 Bad Request**

```json
{
  "message": "Invalid beer id"
}
```

###### No files uploaded

Status: **400 Bad Request**

```json
{
  "message": "No files uploaded"
}
```

###### Unsupported file type

Status: **400 Bad Request**

```json
{
  "message": "Unsupported file type. Allowed: jpeg, png, webp"
}
```

###### File too large

Status: **400 Bad Request**

```json
{
  "message": "File too large"
}
```

###### Beer not found

Status: **404 Not Found**

```json
{
  "message": "Beer not Found"
}
```

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

### Delete one beer 🔒

#### Endpoint

DELETE `/beers/:id`

#### Description

Delete an existing beer by its identifier. Only the creator of the beer can delete it.

#### Example request

```http
DELETE /beers/1
Authorization: Bearer <token>
```

#### Response

##### Success response
###### Status: 200 OK

```json
{
  "id": 1,
  "name": "Mont Blanc Blonde",
  "description": "Blonde légère et rafraîchissante aux arômes floraux",
  "alcohol_deg": "5.00",
  "price": "3.50",
  "brewery_id": 1,
  "created_by": "3f2c9a1e-8b7d-4c5e-9f10-2a6b8d4e1c37"
}
```

##### Error responses

En plus des erreurs `401` / `403` communes aux routes protégées (voir [plus haut](#errors-common-to-protected-routes)) :

###### Invalid beer id

Status: **400 Bad Request**

```json
{
  "message": "Invalid beer id"
}
```

###### Beer not found

Status: **404 Not Found**

```json
{
  "message": "Beer not found"
}
```

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

## Breweries

### Get all breweries

#### Endpoint

GET `/breweries`

#### Description

List all breweries (id and name only), sorted alphabetically by name. Public route, no token required. Used by the dashboard to fill the brewery select when creating a beer (`brewery_id`).

#### Example request

```http
GET /breweries
```

#### Response

##### Success response
###### Status: 200 OK

```json
[
  { "id": 6, "name": "Brasserie Cantillon" },
  { "id": 13, "name": "Brasserie Chimay" }
]
```

##### Error responses

###### Internal server error

Status: **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```
