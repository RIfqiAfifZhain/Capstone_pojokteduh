import { Router } from "express";
import { searchSpots, getSpotBySlug } from "../controllers/spots.controller.js"; 
import { getSpotReviews } from "../controllers/reviews.controller.js";
import { validateQuery } from "../middlewares/validate.middleware.js";
import { searchSpotsQuerySchema } from "../schemas/spots.schema.js";

const router = Router();

router.get("/search", validateQuery(searchSpotsQuerySchema), searchSpots);

router.get("/:id/reviews", getSpotReviews);

router.get("/:slug", getSpotBySlug);

export default router;