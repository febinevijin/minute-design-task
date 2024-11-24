import mongoose from "mongoose";
import {  SlotTypeEnum } from "../utils/enum.js";
import { ObjectId } from "../utils/mongoUtils.js";

const ParkingSlotSchema = new mongoose.Schema(
  {
    slotType: {
      type: String,
      enum: {
        values: Object.values(SlotTypeEnum),
        message: "Please provide valid slot type",
      },
      required: true,
    },
    slotName: { type: String, required: true, unique: true },

    lastUpdated: { type: Date, default: Date.now },
    // currentRecord: {
    //   type: ObjectId,
    //   ref: "parkingRecords",
    // }, // Reference active record
    parkingStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const ParkingSlot = mongoose.model("parkingSlots", ParkingSlotSchema);

export default ParkingSlot;
