import { Document, Schema } from 'mongoose';
import { IUser } from './IUser';

export interface IMessage {
  sender: Schema.Types.ObjectId | IUser;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isUpdated?: boolean;
}

export interface IChat extends Document {
  poolId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  message: IMessage;
  createdAt?: Date;
  updatedAt?: Date;
}

