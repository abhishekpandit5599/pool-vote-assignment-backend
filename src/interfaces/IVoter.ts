import { Schema } from "mongoose";
import { Document } from 'mongoose';

export interface IVoter extends Document {
  userId: Schema.Types.ObjectId; // User ID
  poolId: Schema.Types.ObjectId; // Pool ID
  option: string;
  createdAt?: Date;
  updatedAt?: Date;
}
