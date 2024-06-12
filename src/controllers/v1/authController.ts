import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendOtpEmail } from "../../utils/otpUtils";
import { IUser } from "../../interfaces/IUser";
import { successResponse, errorResponse } from "../../utils/responseUtils";
import successMessages from "../../config/successMessages.json";
import errorMessages from "../../config/errorMessages.json";

const JWT_SECRET = process.env.JWT_SECRET!;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "300", 10);
const OTP_RESEND_INTERVAL = parseInt(
  process.env.OTP_RESEND_INTERVAL || "30",
  10
);

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(errorResponse(errorMessages.USER_ALREADY_EXISTS));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = new User({
      email,
      password: hashedPassword,
      ipAddress,
    });

    await user.save();
    return res
      .status(201)
      .json(successResponse(successMessages.USER_REGISTERED));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse(errorMessages.USER_NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(errorResponse(errorMessages.INVALID_CREDENTIALS));
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "12h",
    });
    return res.json(successResponse({ token }));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse(errorMessages.USER_NOT_FOUND));
    }

    const now = Date.now();
    if (
      user.otp &&
      user.otpExpire &&
      now < user.otpExpire - OTP_RESEND_INTERVAL * 1000
    ) {
      return res
        .status(400)
        .json(errorResponse(errorMessages.OTP_RESEND_NOT_ALLOWED));
    }

    const otp = uuidv4().slice(0, 6);
    user.otp = otp;
    user.otpExpire = now + OTP_EXPIRATION * 1000;

    await user.save();
    await sendOtpEmail(user.email, otp);

    return res.json(successResponse(successMessages.OTP_SENT));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse(errorMessages.USER_NOT_FOUND));
    }

    const now = Date.now();
    if (!user.otp || user.otpExpire! < now) {
      return res.status(400).json(errorResponse(errorMessages.OTP_EXPIRED));
    }

    if (user.otp !== otp) {
      return res.status(400).json(errorResponse(errorMessages.OTP_EXPIRED));
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.verified = true;

    await user.save();
    return res.json(successResponse(successMessages.OTP_VERIFIED));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse(errorMessages.USER_NOT_FOUND));
    }

    const otp = uuidv4().slice(0, 6);
    user.otp = otp;
    user.otpExpire = Date.now() + OTP_EXPIRATION * 1000;

    await user.save();
    await sendOtpEmail(user.email, otp);

    return res.json(successResponse(successMessages.OTP_SENT));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse(errorMessages.USER_NOT_FOUND));
    }

    const now = Date.now();
    if (!user.otp || user.otpExpire! < now) {
      return res.status(400).json(errorResponse(errorMessages.OTP_EXPIRED));
    }

    if (user.otp !== otp) {
      return res.status(400).json(errorResponse(errorMessages.OTP_EXPIRED));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();
    return res.json(successResponse(successMessages.PASSWORD_RESET));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(errorMessages.INTERNAL_SERVER_ERROR));
  }
};
