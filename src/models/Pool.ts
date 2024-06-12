import { Schema, model, Document } from "mongoose";
import { IPool } from "../interfaces/IPool";

interface IPoolDocument extends IPool, Document {}

const PoolSchema = new Schema<IPoolDocument>(
  {
    topic: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: {
      type: Object,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

const Pool = model<IPoolDocument>("Pool", PoolSchema);

export default Pool;
