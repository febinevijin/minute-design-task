import { generateAPIError } from "../../error/apiError.js";
import ParkingSlot from "../../models/ParkingSlot.js";
import User from "../../models/User.js";
import { SlotTypeEnum, UserRole } from "../../utils/enum.js";

const submitForm = async (formData, next) => {
  let { email, phoneNumber, category } = formData;
  // check user exist with same email and userName or phone
  const checkUserExists = await User.findOne(
    {
      role: UserRole.USER,
      category,
      isDeleted: false,
      $or: [{ email }, { phoneNumber }],
    },
    "email phoneNumber"
  );
  // Determine which field caused the conflict and return the appropriate error message
  if (checkUserExists) {
    let errorMessage = "User already submitted form with the same ";

    if (checkUserExists.email === email) {
      errorMessage += "email for this category.";
    } else if (checkUserExists.phoneNumber === phoneNumber) {
      errorMessage += "phone number for this category.";
    }
    return next(generateAPIError(errorMessage, 400));
  }

  const newUser = await User.create(formData);
  if (newUser) {
    // After creating the user, create a wallet for the user with all balances set to 0

    return { message: "form submitted successfully" };
  } else {
    return next(generateAPIError("form submission failed", 400));
  }
};

const parkingDetails = async () => {
  const aggregationPipeline = [
    {
      $facet: {
        slotDetails: [
          {
            $project: {
              _id: 0, // Exclude the _id field from the slot details
              slotName: 1, // Include slotName
              slotType: 1, // Include slotType
              parkingStatus: 1, // Include parkingStatus
            },
          },
        ],
        summary: [
          {
            $group: {
              _id: "$slotType", // Group by slotType (CAR or BIKE)
              totalSlots: { $sum: 1 }, // Count total slots for each type
              remainingSlots: {
                $sum: { $cond: [{ $eq: ["$parkingStatus", false] }, 1, 0] },
              }, // Count available slots
            },
          },
          {
            $group: {
              _id: null,
              carSlots: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id", SlotTypeEnum.CAR] },
                    "$totalSlots",
                    0,
                  ],
                },
              },
              remainingCarSlots: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id", SlotTypeEnum.CAR] },
                    "$remainingSlots",
                    0,
                  ],
                },
              },
              bikeSlots: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id", SlotTypeEnum.BIKE] },
                    "$totalSlots",
                    0,
                  ],
                },
              },
              remainingBikeSlots: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id", SlotTypeEnum.BIKE] },
                    "$remainingSlots",
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$summary",
    },
    {
      $project: {
        totalCarSlots: "$summary.carSlots",
        remainingCarSlots: "$summary.remainingCarSlots",
        totalBikeSlots: "$summary.bikeSlots",
        remainingBikeSlots: "$summary.remainingBikeSlots",
        slotDetails: 1,
      },
    },
  ];

  const result = await ParkingSlot.aggregate(aggregationPipeline);
  return result[0];
};



export const userService = {
  submitForm,
  parkingDetails,

};
