import { Schema } from "mongoose";
import { Document } from 'mongoose';

export interface IPool extends Document {
  topic: string;
  options: string[];
  createdBy: Schema.Types.ObjectId; // User ID
  votes: { [key: string]: number };
  createdAt?: Date;
  updatedAt?: Date;
}
