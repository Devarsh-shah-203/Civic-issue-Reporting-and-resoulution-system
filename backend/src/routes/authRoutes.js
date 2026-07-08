import express from "express";

import {
register,
login,
refreshToken,
logout
}
from "../controllers/authController.js";

import { sendVerificationCode, verifyOtp } from "../controllers/verifymail.js";

const router = express.Router();



router.post(
"/register",
register
);


router.post(
"/login",
login
);


router.post(
"/refresh-token",
refreshToken
);


router.post(
"/logout",
logout
);

router.post("/forgot-password", sendVerificationCode);
router.post("/verify-otp", verifyOtp);


export default router;