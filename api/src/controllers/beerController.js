import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {findAllBeers, findOneBeer, addBeer, updateBeer, deleteBeer} from "../repositories/beerRepository.js";
import { addPhotoToBeer } from "../repositories/photoRepository.js";
import { findBreweryById } from "../repositories/breweryRepository.js";

export async function getBeers(req, res) {
    try {
        const beers = await findAllBeers();
        res.status(200).json(beers);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getOneBeer(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)){
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        const beer = await findOneBeer(id)

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
        const brewery = await findBreweryById(req.body.brewery_id);
        if (!brewery) {
            return res.status(404).json({
                message: "Brewery not found"
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

export async function modifyBeer(req, res) {

    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        if (req.body.brewery_id !== undefined) {
            const brewery = await findBreweryById(req.body.brewery_id);
            if (!brewery) {
                return res.status(404).json({
                    message: "Brewery not found"
                });
            }
        }

        const newBeer = await updateBeer(id, req.body);

        if (!newBeer) {
            return res.status(404).json({
                message: "Beer not found"
            });
        }

        res.status(200).json(newBeer);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function addBeerPhotos(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "No files uploaded"
            });
        }

        const beer = await findOneBeer(id);
        if (!beer) {
            return res.status(404).json({
                message: 'Beer not Found'
            });
        }

        const photos = await Promise.all(req.files.map(async (file) => {
            const filename = `${randomUUID()}${path.extname(file.originalname)}`;
            const filePath = path.join(process.cwd(), "uploads", "beers", filename);
            await writeFile(filePath, file.buffer);

            const url = `/uploads/beers/${filename}`;
            return addPhotoToBeer(id, url);
        }));

        res.status(201).json(photos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function removeBeer(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)){
            return res.status(400).json({
                message: 'Invalid beer id'
            });
        }

        const beer = await deleteBeer(id)

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

