// packages
import bcrypt from "bcryptjs";
// models
import User from "../models/User.js";
// utilities
import { UserRole } from "../utils/enum.js";
import { generateAPIError } from "../error/apiError.js";
import generateToken from "../utils/generateToken.js";



// admin auth
const adminSignUp = async (adminData) => {
  const { email, password } = adminData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });
  return admin;
};

const adminLogin = async (loginData, next) => {
  const { email, password } = loginData;

  // Find the user by email or username
  const admin = await User.findOne({
    role: UserRole.ADMIN,
    email: email,
  }).select("-chosenExpertise");

  // Check if the user exists
  if (!admin) {
    return next(generateAPIError("Invalid email or password.", 400));
  }

  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    return next(generateAPIError("Invalid password.", 400));
  }

  // check user and user password are correct or not , then create token with user _id
  const token = await generateToken(admin?._id);
  return {
    ...admin.toObject(),
    password: undefined, // Exclude the 'password' field
    token,
  };
};









export const authService = {
  adminSignUp,
  adminLogin,
  
};
