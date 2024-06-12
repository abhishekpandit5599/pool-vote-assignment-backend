"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/v1/authController");
const validateRequest_1 = require("../../middleware/validateRequest");
const authValidationSchema_1 = require("../../validations/authValidationSchema");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.validateRequest)(authValidationSchema_1.registerSchema), authController_1.register);
router.post('/login', (0, validateRequest_1.validateRequest)(authValidationSchema_1.loginSchema), authController_1.login);
router.post('/send-otp', (0, validateRequest_1.validateRequest)(authValidationSchema_1.otpSchema), authController_1.sendOtp);
router.post('/verify-otp', (0, validateRequest_1.validateRequest)(authValidationSchema_1.verifyOtpSchema), authController_1.verifyOtp);
router.post('/forgot-password', (0, validateRequest_1.validateRequest)(authValidationSchema_1.otpSchema), authController_1.forgotPassword);
router.post('/reset-password', (0, validateRequest_1.validateRequest)(authValidationSchema_1.resetPasswordSchema), authController_1.resetPassword);
exports.default = router;