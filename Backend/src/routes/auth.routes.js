import express from 'express'
import { register,login,logout } from '../controller/auth.controller.js';
import {verify,Mail}from "../controller/MailVerify.controller.js"
import reset from "../controller/resetPassword.controller.js"
import authenticate from "../middleware/authenticate.middleware.js"

const router = express.Router();

router.post("/forgot-password",Mail);
router.post("/verifyCode",verify);
router.post("/reset", reset)

router.post("/register",register);
router.post("/login",login);
router.post("/logout",authenticate,logout);

export default router;