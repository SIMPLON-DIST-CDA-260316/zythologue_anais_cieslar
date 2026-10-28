export type Beer = {
    beer_id: number
    beer_name: string
    description: string
    alcohol_deg: string
    price: string
    brewery_id: number
    brewery_name: string
    ingredients: string[] | null
    categories: string[] | null
    photos: string[] | null
}

export type Brewery = {
    id: number
    name: string
}