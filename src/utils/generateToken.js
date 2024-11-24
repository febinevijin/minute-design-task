import jwt from "jsonwebtoken";
import { appConfig } from "../config/appConfig.js";
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, appConfig.jwtSecret, {
    expiresIn: "15d",
  });

  //   res.cookie("threadsUser", token, {
  //     httpOnly: true, // more secure
  //     maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  //     sameSite: "strict", // CSRF
  //   });

  return token;
};

export const verifyAccessKey = (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    console.log(err);
    console.log(err.message);
    const error = new Error(err.message);
    error.statusCode = 403; // Attach the status code to the error object
    error.status = "failed";
    throw error;
  }
};

export default generateToken;
