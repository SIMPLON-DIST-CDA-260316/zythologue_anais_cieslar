import { Router } from "express";
import { getBeers, getOneBeer, createBeer, modifyBeer, removeBeer, addBeerPhotos } from "../controllers/beerController.js";
import { handleUpload } from "../middlewares/upload.js";
import { validate } from "../validation/validate.js";
import { createBeerSchema, updateBeerSchema } from "../validation/beerValidation.js";
import {authenticate} from "../middlewares/auth.js";

const router = Router();

router.get("/", getBeers);
router.get("/:id", getOneBeer);
router.post("/", authenticate, validate(createBeerSchema), createBeer);
router.post("/:id/photos", authenticate, handleUpload, addBeerPhotos);
router.patch("/:id", authenticate, validate(updateBeerSchema), modifyBeer);
router.delete("/:id", authenticate, removeBeer);

export default router;