import { Router } from "express";
import { getAdminProfile } from "../controllers/admins.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authenticate, getAdminProfile);

export default router;
