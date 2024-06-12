import { Router } from 'express';
import { register, login, sendOtp, verifyOtp, forgotPassword, resetPassword } from '../../controllers/v1/authController';
import { validateRequest } from '../../middleware/validateRequest';
import { registerSchema, loginSchema, otpSchema, verifyOtpSchema, resetPasswordSchema } from '../../validations/authValidationSchema';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/send-otp', validateRequest(otpSchema), sendOtp);
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);
router.post('/forgot-password', validateRequest(otpSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

export default router;
