import nodemailer from "nodemailer";
import Joi from "joi";
import crypto from "crypto";

// Configuration for the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APPLICATION_GMAIL, // generated ethereal user
    pass: process.env.APPLICATION_GMAIL_PASSWORD, // generated ethereal password
  },
});

// Function to generate an OTP
export const generateOtp = (): string => {
  const otp = crypto.randomBytes(3).toString("hex");
  return otp;
};

// Validation schema for the email
const emailSchema = Joi.string().email().required();

// Function to send OTP email
export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  // Validate email
  const { error } = emailSchema.validate(email);
  if (error) {
    throw new Error("Invalid email address");
  }

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: email, // list of receivers
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is ${otp}`, // plain text body
    html: `<p>Your OTP code is <strong>${otp}</strong></p>`, // html body
  });
};
