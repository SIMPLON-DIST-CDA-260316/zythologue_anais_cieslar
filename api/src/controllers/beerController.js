import {findById} from "../repositories/beerRepository.js";

export async function getOneBeer(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)){
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        const beer = await findById(id)

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