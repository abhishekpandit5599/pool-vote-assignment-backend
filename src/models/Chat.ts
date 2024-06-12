import { Schema, model } from "mongoose";
import { IChat, IMessage } from "../interfaces/IChat";

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema<IChat>(
  {
    poolId: {
      type: Schema.Types.ObjectId,
      ref: "Pool",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: MessageSchema,
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", ChatSchema);

export default Chat;