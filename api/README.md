# API Documentation

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

### Create one beer

#### Endpoint

POST `/beers`

#### Description

Create a new beer. The request body is validated with Zod before reaching the database, and `brewery_id` must reference an existing brewery.

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
  "brewery_id": 1
}
```

Note : la réponse de création renvoie les noms de colonnes bruts de la table `beer` (`id`, `name`, `brewery_id`...), différents de ceux renvoyés par `GET /beers`/`GET /beers/:id` (`beer_id`, `beer_name`, `brewery_name`...). C'est une incohérence connue, pas corrigée pour l'instant.

##### Error responses

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

### Update one beer

#### Endpoint

PATCH `/beers/:id`

#### Description

Update one or more fields of an existing beer. All fields are optional, but at least one must be provided. If `brewery_id` is provided, it must reference an existing brewery.

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
  "brewery_id": 1
}
```

##### Error responses

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

### Add photos to a beer

#### Endpoint

POST `/beers/:id/photos`

#### Description

Upload one or more photos for an existing beer. The request must be sent as `multipart/form-data`, with each file under the field name `photos` (repeat the field to send several files in one request).

Accepted file types: `image/jpeg`, `image/png`, `image/webp`. Maximum size: 5 MB per file. No limit on the number of files.

#### Example request

```http
POST /beers/1/photos
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

### Delete one beer

#### Endpoint

DELETE `/beers/:id`

#### Description

Delete an existing beer by its identifier.

#### Example request

```http
DELETE /beers/1
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
  "brewery_id": 1
}
```

##### Error responses

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
