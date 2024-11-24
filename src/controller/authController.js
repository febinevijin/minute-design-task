import { generateAPIError } from "../error/apiError.js";
import errorWrapper from "../middleware/errorWrapper.js";
import { authService } from "../service/authService.js";
import { responseUtils } from "../utils/responseUtils.js";
import { userSignUpValidation } from "../validation/authValidation.js";

// admin auth
export const adminSignUp = errorWrapper(async (req, res, next) => {
  req.body.email = req.body.email.toString();
  req.body.password = req.body.password.toString();
  const data = await authService.adminSignUp(req.body);
  return responseUtils.success(res, {
    data,
    status: 201,
  });
});

export const adminLogin = errorWrapper(async (req, res, next) => {
  const data = await authService.adminLogin(req.body, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});





