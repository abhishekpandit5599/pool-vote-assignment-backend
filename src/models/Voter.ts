import { Schema, model, Document } from "mongoose";
import { IVoter } from "../interfaces/IVoter";

interface IVoterDocument extends IVoter, Document {}

const VoterSchema = new Schema<IVoterDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    poolId: {
      type: Schema.Types.ObjectId,
      ref: 'Pool',
      required: true,
    },
    option: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Voter = model<IVoterDocument>("Voter", VoterSchema);

export default Voter;