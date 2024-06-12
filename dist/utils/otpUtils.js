"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = exports.generateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const joi_1 = __importDefault(require("joi"));
const crypto_1 = __importDefault(require("crypto"));
// Configuration for the email transporter
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APPLICATION_GMAIL, // generated ethereal user
        pass: process.env.APPLICATION_GMAIL_PASSWORD, // generated ethereal password
    },
});
// Function to generate an OTP
const generateOtp = () => {
    const otp = crypto_1.default.randomBytes(3).toString("hex");
    return otp;
};
exports.generateOtp = generateOtp;
// Validation schema for the email
const emailSchema = joi_1.default.string().email().required();
// Function to send OTP email
const sendOtpEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email
    const { error } = emailSchema.validate(email);
    if (error) {
        throw new Error("Invalid email address");
    }
    // Send email
    yield transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: email, // list of receivers
        subject: "Your OTP Code", // Subject line
        text: `Your OTP code is ${otp}`, // plain text body
        html: `<p>Your OTP code is <strong>${otp}</strong></p>`, // html body
    });
});
exports.sendOtpEmail = sendOtpEmail;
