import { generateAPIError } from "../../error/apiError.js";
import errorWrapper from "../../middleware/errorWrapper.js";
import { adminService } from "../../service/admin/adminService.js";
import { SlotTypeEnum } from "../../utils/enum.js";
import { responseUtils } from "../../utils/responseUtils.js";

export const addParkingSlot = errorWrapper(async (req, res, next) => {
  const { slotType, slotName } = req.body;

  // Validate input
  if (!slotType || !slotName) {
    return next(generateAPIError("slotType and slotName are required.", 400));
  }
  // Check if slotType is valid
  if (!Object.values(SlotTypeEnum).includes(slotType)) {
    const errorMessage = `Invalid slotType. Allowed values are: ${Object.values(SlotTypeEnum).join(", ")}.`;
    return next(generateAPIError(errorMessage, 400));
  }
  const data = await adminService.addParkingSlot(slotType, slotName);

  // Send response
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const listParkedVehicles = errorWrapper(async (req, res, next) => {
  // Fetch all plans using the service
  const data = await adminService.listParkedVehicles();

  // Send response
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const parkVehicle = errorWrapper(async (req, res, next) => {
  const { vehicleId, slotName } = req.body;
  const data = await adminService.parkVehicle(vehicleId, slotName, next);
  return responseUtils.success(res, {
    data,
    status: 201,
  });
});
export const leaveParkingLot = errorWrapper(async (req, res, next) => {
  const { vehicleId } = req.body;
  const data = await adminService.leaveParkingLot(vehicleId, next);
  return responseUtils.success(res, {
    data,
    status: 201,
  });
});
