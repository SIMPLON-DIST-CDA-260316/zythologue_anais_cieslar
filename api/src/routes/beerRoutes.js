import { Router } from "express";
import { getBeers, getOneBeer, createBeer, modifyBeer, removeBeer, addBeerPhotos } from "../controllers/beerController.js";
import { handleUpload } from "../middlewares/upload.js";
import { validate } from "../validation/validate.js";
import { createBeerSchema, updateBeerSchema } from "../validation/beerValidation.js";

const router = Router();

router.get("/", getBeers);
router.get("/:id", getOneBeer);
router.post("/", validate(createBeerSchema), createBeer);
router.post("/:id/photos", handleUpload, addBeerPhotos);
router.patch("/:id", validate(updateBeerSchema), modifyBeer);
router.delete("/:id", removeBeer);

export default router;