import { Router } from "express";
import { getUserProfile, updateProfile, updatePassword, getUserReviews } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);
router.put("/profile/password", updatePassword);
router.get("/profile/reviews", getUserReviews);

export default router;