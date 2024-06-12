import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    ipAddress?: string;
    otp?: string;
    otpExpire?: number;
    visible: boolean;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
