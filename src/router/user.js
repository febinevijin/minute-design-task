import { Router } from "express";
import { parkingDetails } from "../controller/user/userController.js";

const router = Router();

router.get("/parking-slots/availability", parkingDetails);

export default router;
