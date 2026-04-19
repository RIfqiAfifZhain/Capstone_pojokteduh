import { Router } from "express";
import { registerUser, loginUser, registerAdmin, loginAdmin } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema, registerAdminSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/user/register", validate(registerUserSchema), registerUser);
router.post("/user/login", validate(loginSchema), loginUser);

router.post("/admin/register", validate(registerAdminSchema), registerAdmin);
router.post("/admin/login", validate(loginSchema), loginAdmin);

export default router;
