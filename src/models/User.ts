import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ipAddress: { type: String },
    otp: { type: String },
    otpExpire: { type: Number },
    visible: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexing
UserSchema.index({ username: 1 });

const User = model<IUserDocument>("User", UserSchema);

export default User;
