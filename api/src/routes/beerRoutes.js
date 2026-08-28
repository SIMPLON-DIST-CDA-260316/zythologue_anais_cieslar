import { Router } from "express";
import { getBeers, getOneBeer, createBeer, modifyBeer, removeBeer, addBeerPhotos } from "../controllers/beerController.js";
import { handleUpload } from "../middlewares/upload.js";

const router = Router();

router.get("/", getBeers);
router.get("/:id", getOneBeer);
router.post("/", createBeer);
router.post("/:id/photos", handleUpload, addBeerPhotos);
router.patch("/:id", modifyBeer);
router.delete("/:id", removeBeer);

export default router;