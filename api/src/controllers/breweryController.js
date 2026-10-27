import {findAllBreweries} from "../repositories/breweryRepository.js";

export async function getBreweries(req, res) {
    try {
        const breweries = await findAllBreweries();
        res.status(200).json(breweries);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}