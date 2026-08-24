# API Documentation

## Beers

### Get one beer

#### Endpoint

GET `/beers/:id`

#### Description

Find a beer by its id.

#### Example request

```http
GET /beers/1
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


###### Beer not found
###### Status: 404 Not Found

```json
{
"message": "Beer not found"
}
```

###### Invalid id type
###### Status: 400 Bad Request

```json
{
"message": "Invalid beer id"
}
```

### Create one beer

#### Endpoint

POST `/beers`

#### Description

Create a new beer.

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
  "name": "Mélusine Brune",
  "description": "Brune douce aux arômes de chocolat au lait",
  "alcohol_deg": "5.80",
  "price": "3.80",
  "brewery_id": 19
}
```

##### Error responses

###### Missing required fields

Status: **400 Bad Request**

```json
{
  "message": "Missing required fields"
}
```

###### Name cannot be empty

Status: **400 Bad Request**

```json
{
  "message": "Name cannot be empty"
}
```

###### Alcohol degree must be a positive number

Status: **400 Bad Request**

```json
{
  "message": "Alcohol degree must be a positive number"
}
```

###### Price must be a positive number

Status: **400 Bad Request**

```json
{
  "message": "Price must be a positive number"
}
```

###### A valid brewery_id is required

Status: **400 Bad Request**

```json
{
  "message": "A valid brewery_id is required"
}
```
### Update one beer

#### Endpoint

PATCH `/beers/:id`

#### Description

Update one or more fields of an existing beer.

#### Request body

All fields are optional. Only the provided fields will be updated.

```json
{
  "price": 4.50
}
```

Or

```json
{
  "name": "Mont Blanc Blanche",
  "description": "White beer",
  "alcohol_deg": 4.8,
  "price": 3.80,
  "brewery_id": 1
}
```

#### Success response

##### Status: 200 OK

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

#### Error responses

###### Invalid beer id

##### Status: 400 Bad Request

```json
{
  "message": "Invalid beer id"
}
```

###### Request body cannot be empty

##### Status: 400 Bad Request

```json
{
  "message": "No fields to update"
}
```

###### Name cannot be empty

##### Status: 400 Bad Request

```json
{
  "message": "Name cannot be empty"
}
```

###### Alcohol degree must be a positive number

##### Status: 400 Bad Request

```json
{
  "message": "Alcohol degree must be a positive number"
}
```

###### Price must be a positive number

##### Status: 400 Bad Request

```json
{
  "message": "Price must be a positive number"
}
```

###### A valid brewery_id is required

##### Status: 400 Bad Request

```json
{
  "message": "A valid brewery_id is required"
}
```

###### Beer not found

##### Status: 404 Not Found

```json
{
  "message": "Beer not found"
}
```

###### Internal server error

##### Status: 500 Internal Server Error

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

#### Success response

##### Status: 200 OK

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

#### Error responses

##### Invalid beer id

##### Status: 400 Bad Request

```json
{
  "message": "Invalid beer id"
}
```

##### Beer not found

##### Status: 404 Not Found

```json
{
  "message": "Beer not found"
}
```

##### Internal server error

##### Status: 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```