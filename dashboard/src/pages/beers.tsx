import {useEffect, useState} from "react";
import {Table, TableHead, TableHeader, TableRow, TableCell, TableBody} from "@/components/ui/table.tsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/contexts/auth-context.tsx";
import {BeerFormDialog} from "@/components/beer-form-dialog.tsx";
import type {Beer, Brewery} from "@/lib/types.ts";


export default function BeersPage() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [breweries, setBreweries] = useState<Brewery[]>([]);
    const {isAuth, token} = useAuth()
    const [error, setError] = useState<string | null>(null);

    async function fetchBeers() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/beers`);
        return await response.json();
    }

    async function fetchBreweries() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/breweries`);
        return await response.json();
    }

    async function refreshBeers() {
        setBeers(await fetchBeers())
    }

    useEffect(() => {
        fetchBeers().then((data) => setBeers(data))
        fetchBreweries().then((data) => setBreweries(data))
    }, [])

    async function handleDelete(beer_id: number) {
        setError(null)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/beers/${beer_id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token },
            })
            const data = await response.json()

            if (!response.ok) {
                setError(response.status===403 ? "Vous ne pouvez supprimer que les bières que vous avez créées.":data.message)
                return
            }
            setBeers(beers.filter((beer) => beer.beer_id !== beer_id))

        } catch {
            setError("Impossible de contacter le serveur")
        }

    }

    if (!isAuth) {
        return <p>Vous devez être connecté</p>
    }

    return (
        <div>
        <BeerFormDialog breweries={breweries} onSuccess={refreshBeers} />
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
                <TableHead>Actions</TableHead>

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
                    <TableCell>
                        <div className="flex gap-1">
                        <BeerFormDialog beer={beer} breweries={breweries} onSuccess={refreshBeers} />
                        <AlertDialog onOpenChange={()=>setError(null)}>
                            <AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
                                <Trash2Icon/>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Supprimer {beer.beer_name}?
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                {error && <p className="text-destructive">{error}</p>}
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={()=> handleDelete(beer.beer_id)}>Supprimer</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>

                        </AlertDialog>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    )
}
