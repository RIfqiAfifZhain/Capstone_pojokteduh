import { Router } from "express";
import { addOrUpdateReview } from "../controllers/reviews.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addReviewSchema } from "../schemas/reviews.schema.js";

const router = Router();

// POST /reviews → Wajib login, validasi body, lalu upsert review
router.post("/", authenticate, validate(addReviewSchema), addOrUpdateReview);

export default router;
