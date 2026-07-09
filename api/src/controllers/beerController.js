import {getById, addBeer} from "../repositories/beerRepository.js";

export async function findOneBeer(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)){
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        const beer = await getById(id)

        if (!beer) {
            return res.status(404).json({
                message: 'Beer not Found'
            });
        }

        res.status(200).json(beer);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function createBeer(req, res) {

    try {
        const { name, description, alcohol_deg, price, brewery_id } = req.body;

        if ( name === undefined || description === undefined || alcohol_deg === undefined || price === undefined || brewery_id === undefined) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (name.trim().length === 0) {
            return res.status(400).json({
                message: "Name cannot be empty"
            });
        }

        if (typeof alcohol_deg !== "number" || alcohol_deg < 0) {
            return res.status(400).json({
                message: "Alcohol degree must be a positive number"
            })
        }

        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({
                message: "Price must be a positive number"
            });
        }

        if (typeof brewery_id !== "number" || brewery_id < 1) {
            return res.status(400).json({
                message: "A valid brewery_id is required"
            });
        }

        const beer = await addBeer(req.body);
        res.status(201).json(beer);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}