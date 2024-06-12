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
exports.resetPassword = exports.forgotPassword = exports.verifyOtp = exports.sendOtp = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const otpUtils_1 = require("../../utils/otpUtils");
const responseUtils_1 = require("../../utils/responseUtils");
const successMessages_json_1 = __importDefault(require("../../config/successMessages.json"));
const errorMessages_json_1 = __importDefault(require("../../config/errorMessages.json"));
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "300", 10);
const OTP_RESEND_INTERVAL = parseInt(process.env.OTP_RESEND_INTERVAL || "30", 10);
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_ALREADY_EXISTS));
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            password: hashedPassword,
            ipAddress,
        });
        yield user.save();
        return res
            .status(201)
            .json((0, responseUtils_1.successResponse)(successMessages_json_1.default.USER_REGISTERED));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_NOT_FOUND));
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INVALID_CREDENTIALS));
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "12h",
        });
        return res.json((0, responseUtils_1.successResponse)({ token }));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.login = login;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_NOT_FOUND));
        }
        const now = Date.now();
        if (user.otp &&
            user.otpExpire &&
            now < user.otpExpire - OTP_RESEND_INTERVAL * 1000) {
            return res
                .status(400)
                .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.OTP_RESEND_NOT_ALLOWED));
        }
        const otp = (0, uuid_1.v4)().slice(0, 6);
        user.otp = otp;
        user.otpExpire = now + OTP_EXPIRATION * 1000;
        yield user.save();
        yield (0, otpUtils_1.sendOtpEmail)(user.email, otp);
        return res.json((0, responseUtils_1.successResponse)(successMessages_json_1.default.OTP_SENT));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_NOT_FOUND));
        }
        const now = Date.now();
        if (!user.otp || user.otpExpire < now) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.OTP_EXPIRED));
        }
        if (user.otp !== otp) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.OTP_EXPIRED));
        }
        user.otp = undefined;
        user.otpExpire = undefined;
        user.verified = true;
        yield user.save();
        return res.json((0, responseUtils_1.successResponse)(successMessages_json_1.default.OTP_VERIFIED));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.verifyOtp = verifyOtp;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_NOT_FOUND));
        }
        const otp = (0, uuid_1.v4)().slice(0, 6);
        user.otp = otp;
        user.otpExpire = Date.now() + OTP_EXPIRATION * 1000;
        yield user.save();
        yield (0, otpUtils_1.sendOtpEmail)(user.email, otp);
        return res.json((0, responseUtils_1.successResponse)(successMessages_json_1.default.OTP_SENT));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.USER_NOT_FOUND));
        }
        const now = Date.now();
        if (!user.otp || user.otpExpire < now) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.OTP_EXPIRED));
        }
        if (user.otp !== otp) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.OTP_EXPIRED));
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpire = undefined;
        yield user.save();
        return res.json((0, responseUtils_1.successResponse)(successMessages_json_1.default.PASSWORD_RESET));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.resetPassword = resetPassword;
