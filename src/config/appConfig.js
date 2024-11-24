import { config } from "dotenv";

config();

export const appConfig = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  whitelist: process.env.WHITELIST,
  jwtSecret: process.env.JWT_SECRET,
};
