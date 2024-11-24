import { appConfig } from "../config/appConfig.js";
import User from "../models/User.js";
import { UserRole } from "../utils/enum.js";
import { verifyAccessKey } from "../utils/generateToken.js";

export const protect = (allowedRoles) => {
  return async (req, res, next) => {
    // Check if allowedRoles is provided and valid
    if (
      !Array.isArray(allowedRoles) ||
      !allowedRoles.every((role) => Object.values(UserRole).includes(role))
    ) {
      return res
        .status(400)
        .send({ message: "Invalid or missing allowed roles" });
    }
    let token;
    if (req.headers.authorization?.startsWith("Bearer") === true) {
      try {
        token = req.headers.authorization.split(" ")[1];
        if (!token) {
          res.status(401).send({ message: "Not Authorized,No token" });
        }
        const decoded = verifyAccessKey(token, appConfig.jwtSecret);
        if (decoded && decoded.userId) {
          const user = await User.findOne({ _id: decoded.userId }).select(
            "_id email role isActive",
          );
          if (user && allowedRoles.includes(user.role)) {
            // User has an allowed role, allow access to the route
            if (user.role !== UserRole.ADMIN && !user.isActive)
              res.status(403).send({ message: "account is de-activated" });
            req.user = user;
            next();
          } else {
            res.status(403).send({ message: "Forbidden" });
          }
        }
      } catch (error) {
        console.log(error.message);
        res.status(401).send({ message: "Not Authroized" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized, No Bearer token" });
    }
  };
};
