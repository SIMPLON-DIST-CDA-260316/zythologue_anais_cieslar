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

export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
}

export type AuthContextType = {
    isAuth: boolean
    login: (token: string) => void
    logout: () => void
    token: string | null
    user: User | null
}