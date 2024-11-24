import mongoose from "mongoose";
import { UserRole } from "../utils/enum.js";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: "Please provide valid role",
      },
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },

  { timestamps: true }
);

// UserSchema.index({  email: 1, role: 1, });

const User = mongoose.model("users", UserSchema);

export default User;
