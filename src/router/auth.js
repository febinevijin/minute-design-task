import { Router } from "express";
import { adminLogin, adminSignUp } from "../controller/authController.js";

const router = Router();

router.post("/admin-signup", adminSignUp);
router.post("/admin-login", adminLogin);

export default router;
