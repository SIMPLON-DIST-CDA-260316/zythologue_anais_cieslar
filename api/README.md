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


#### Example response

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


