import { Router } from "express";
import auth from "./auth.js";

import admin from "./admin.js";
import user from "./user.js";
import ParkingSlot from "../models/ParkingSlot.js";
import { SlotTypeEnum } from "../utils/enum.js";

const router = Router();

router.use("/auth", auth);
// admin routes
router.use("/admin", admin);

// user routes
router.use("/user", user);
// test purpose
router.get("/", async (req, res) => {
  res.status(200).send("server on live");
});

//  to add parking slots
router.post("/parking-slots/add-manually", async (req, res) => {
  try {
    
    const carSlots = 8;
    const bikeSlots = 2;
    const slots = [];
    // Generate car slots
    for (let i = 1; i <= carSlots; i++) {
      slots.push({
        slotType: SlotTypeEnum.CAR,
        slotName: `C${i}`,
      });
    }
    // Generate bike slots
    for (let i = 1; i <= bikeSlots; i++) {
      slots.push({
        slotType: SlotTypeEnum.BIKE,
        slotName: `B${i}`, 
      });
    }

    
    const result = await ParkingSlot.insertMany(slots);

    res.status(201).json({
      message: "Parking slots added successfully",
      slots: result,
    });
  } catch (error) {
    console.error("Error adding parking slots:", error);
    res.status(500).json({ message: "Failed to add parking slots", error });
  }
});

export default router;
