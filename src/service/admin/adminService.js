import ParkingRecord from "../../models/ParkingRecord.js";
import ParkingSlot from "../../models/ParkingSlot.js";

const addParkingSlot = async (slotType, slotName) => {
  const newSlot = await ParkingSlot.create({
    slotType,
    slotName,
  });
  return {
    message: "Parking slot added successfully.",
    data: newSlot,
  };
};

const listParkedVehicles = async () => {
  const parkedVehicles = await ParkingRecord.find({ exitTime: null })
    .populate({
      path: "slotUsed", // Field in ParkingRecord that references ParkingSlot
      select: "slotName slotType", // Select only slotName and slotType
    })
    .select("vehicleId entryTime slotUsed");
  return parkedVehicles;
};

const parkVehicle = async (vehicleId, slotName, next) => {
  // 1. Find the parking slot by slotName
  const availableSlot = await ParkingSlot.findOne({
    slotName,
    parkingStatus: false,
  });
  // If no available slot is found or the slot is already occupied
  if (!availableSlot) {
    return next(
      generateAPIError("Slot not available or already occupied.", 400)
    );
  }
  // 2. Create a parking record for the vehicle
  const newParkingRecord = new ParkingRecord({
    vehicleId,
    entryTime: new Date(),
    fixedFee: 10, // Setting the fixed fee as 10
    slotUsed: availableSlot._id, // Reference the parking slot
  });
  // Save the parking record
  await newParkingRecord.save();
  // 3. Update the parking slot's status to occupied
  availableSlot.parkingStatus = true;
  await availableSlot.save();

  return {
    message: "Vehicle parked successfully.",
    parkingRecord: newParkingRecord,
    slotDetails: availableSlot,
  };
};
const leaveParkingLot = async (vehicleId, slotName, next) => {
  // 1. Find the parking record for the vehicle
  const parkingRecord = await ParkingRecord.findOne({
    vehicleId,
    exitTime: { $exists: false },
  });

  if (!parkingRecord) {
    return next(
      generateAPIError("No active parking record found for this vehicle.", 400)
    );
  }
  // 2. Calculate the duration the vehicle has been parked
  const entryTime = new Date(parkingRecord.entryTime);
  const exitTime = new Date();
  const durationInMillis = exitTime - entryTime; // Duration in milliseconds
  const durationInHours = durationInMillis / (1000 * 60 * 60); // Convert to hours
  // 3. Calculate the charge based on the fixed fee per hour
  const charge = Math.ceil(durationInHours) * parkingRecord.fixedFee; // Round up to the next whole hour and calculate charge
  // 4. Update the parking record with exit time and calculated charge
  parkingRecord.exitTime = exitTime;
  parkingRecord.charge = charge;
  await parkingRecord.save();
  // 5. Mark the parking slot as available
  const parkingSlot = await ParkingSlot.findById(parkingRecord.slotUsed);
  if (parkingSlot) {
    parkingSlot.parkingStatus = false; // Mark slot as available

    await parkingSlot.save();
  }
  return {
    message: "Vehicle successfully left the parking lot.",
    parkingRecord,
    charge, // Include the calculated charge
  };
};

export const adminService = {
  addParkingSlot,
  listParkedVehicles,
  parkVehicle,
  leaveParkingLot,
};
