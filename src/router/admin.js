import { Router } from "express";
import { UserRole } from "../utils/enum.js";
import { protect } from "../middleware/auth.js";
import {  addParkingSlot, leaveParkingLot, listParkedVehicles, parkVehicle } from "../controller/admin/adminUserController.js";

const router = Router();
// user management routes


router.post("/add-parking-slot", protect([UserRole.ADMIN]), addParkingSlot);
router.get("/vehicle-list", protect([UserRole.ADMIN]), listParkedVehicles);
router.post("/parking-slot/park", protect([UserRole.ADMIN]), parkVehicle);
router.post("/parking-slot/leave", protect([UserRole.ADMIN]), leaveParkingLot);


export default router;
