import errorWrapper from "../../middleware/errorWrapper.js";
import { userService } from "../../service/user/userService.js";
import { responseUtils } from "../../utils/responseUtils.js";

export const parkingDetails = errorWrapper(async (req, res, next) => {
  const data = await userService.parkingDetails();
  return responseUtils.success(res, {
    data,
    status: 201,
  });
});
