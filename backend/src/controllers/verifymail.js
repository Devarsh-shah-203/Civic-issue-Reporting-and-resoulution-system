
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { resetToken as generateResetToken } from "../utils/generateToken.js";
import SendVerificationCode  from "../utils/email.service.js";

export const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });



    // Generate OTP
    const code = await SendVerificationCode(email);

    if (!code) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code.",
      });
    }

    // Store hashed OTP
    user.resetPasswordToken = await bcrypt.hash(code, 10);
    user.resetCodeExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};


export const verifyOtp = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;

    if (!email || !OTP) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetCodeExpiry
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (Date.now() > user.resetCodeExpiry) {
      user.resetPasswordToken = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Verification code has expired.",
      });
    }

    const isValid = await bcrypt.compare(
      OTP,
      user.resetPasswordToken
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    // OTP verified
    user.resetPasswordToken = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    const resetToken = generateResetToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Verification successful.",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};