import mongoose from "mongoose";

import { ObjectId } from "../utils/mongoUtils.js";

const ParkingRecordSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    entryTime: { type: Date, default: Date.now, required: true },
    exitTime: { type: Date },
    fixedFee: { type: Number, default: 0 },
    slotUsed: {
      type: ObjectId,
      ref: "parkingSlots",
      required: true,
    }, // Reference to ParkingSlot
    charge: { type: Number, default: 0 }, // Total charge (calculated on exit)
    date: { type: Date, default: Date.now, required: true }, // Date of parking activity
  },
  { timestamps: true }
);


const ParkingRecord = mongoose.model("parkingRecords", ParkingRecordSchema);

export default ParkingRecord;
