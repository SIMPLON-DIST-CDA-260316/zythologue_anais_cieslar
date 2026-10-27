import {useEffect, useState} from "react";
import {Table, TableHead, TableHeader, TableRow, TableCell, TableBody} from "@/components/ui/table.tsx";

type Beer = {
    beer_id: number
    beer_name: string
    description: string
    alcohol_deg: string
    price: string
    brewery_name: string
    ingredients: string[] | null
    categories: string[] | null
    photos: string[] | null
}

export default function BeersPage() {
    const [beers, setBeers] = useState<Beer[]>([]);

    useEffect(() => {
        async function fetchBeers() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/beers`);
            const data = await response.json();
            setBeers(data)
        }
        fetchBeers()
    }, [])

    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Degré d'alcool</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Brasserie</TableHead>
                <TableHead>Ingrédients</TableHead>
                <TableHead>Catégories</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {beers.map((beer) => (
                <TableRow key={beer.beer_id}>
                    <TableCell>{beer.beer_id}</TableCell>
                    <TableCell>{beer.beer_name}</TableCell>
                    <TableCell>{beer.description}</TableCell>
                    <TableCell>{beer.alcohol_deg} %</TableCell>
                    <TableCell>{beer.price} €</TableCell>
                    <TableCell>{beer.brewery_name}</TableCell>
                    <TableCell>{beer.ingredients? beer.ingredients.join(", "):"-"}</TableCell>
                    <TableCell>{beer.categories? beer.categories.join(", "): "-"}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}
