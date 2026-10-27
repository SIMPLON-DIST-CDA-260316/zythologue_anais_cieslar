import {Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {z} from "zod";
import {useAuth} from "@/contexts/auth-context.tsx";
import {beerSchema} from "@/lib/validations.ts";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

type Brewery = {
    id: number
    name: string
}

type BeerFieldErrors = {
    name?: string[]
    description?: string[]
    alcohol_deg?: string[]
    price?: string[]
    brewery_id?: string[]
}

export function BeerFormDialog({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState<boolean>(false)
    const [breweries, setBreweries] = useState<Brewery[]>([]);
    const {token} = useAuth()
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<BeerFieldErrors>({})

    useEffect(() => {
        async function fetchBreweries() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/breweries`);
            const data = await response.json();
            setBreweries(data)
        }
        fetchBreweries()
    }, [])

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setFieldErrors({})
        const formData = new FormData(event.currentTarget)
        const result = beerSchema.safeParse({
            name: formData.get("name"),
            description: formData.get("description"),
            alcohol_deg: formData.get("alcohol_deg"),
            price: formData.get("price"),
            brewery_id: formData.get("brewery_id"),
        })

        if (!result.success) {
            setFieldErrors(z.flattenError(result.error).fieldErrors)
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/beers`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(result.data),
            })
            const data = await response.json()

            if (!response.ok) {
                setError(data.message)
                return
            }

            setOpen(false)
            onSuccess()
        } catch {
            setError("Impossible de contacter le serveur")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>Ajouter une bière</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle bière</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} noValidate>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Nom</FieldLabel>
                            <Input id="name" name="name" />
                            <FieldError>{fieldErrors.name?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea id="description" name="description" />
                            <FieldError>{fieldErrors.description?.[0]}</FieldError>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="alcohol_deg">Degré d'alcool (%)</FieldLabel>
                                <Input id="alcohol_deg" name="alcohol_deg" type="number" step="0.01" />
                                <FieldError>{fieldErrors.alcohol_deg?.[0]}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">Prix (€)</FieldLabel>
                                <Input id="price" name="price" type="number" step="0.01" />
                                <FieldError>{fieldErrors.price?.[0]}</FieldError>
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel>Brasserie</FieldLabel>
                            <Select
                                name="brewery_id"
                                items={breweries.map((brewery) => ({ label: brewery.name, value: String(brewery.id) }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choisir une brasserie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {breweries.map((brewery) => (
                                        <SelectItem key={brewery.id} value={String(brewery.id)}>
                                            {brewery.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError>{fieldErrors.brewery_id?.[0]}</FieldError>
                        </Field>
                        <Field>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit">Créer</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
