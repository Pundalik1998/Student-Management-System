import { Router } from "express";
import { getMe, postLogin, postLogout } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validations/authValidation.js";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), postLogin);
authRoutes.post("/logout", postLogout);
authRoutes.get("/me", getMe);

