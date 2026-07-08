import User from "../models/user.js";
import { resetToken } from "../utils/generateToken.js";
import { SendVerificationCode } from "../services/email.service.js";

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
        message: "Invalid or expired OTP.",
      });
    }

    if (Date.now() > user.resetCodeExpiry) {
      user.resetPasswordToken = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (String(OTP) !== user.resetPasswordToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Generate Reset JWT
    const token = resetToken(user._id);

    // Store Reset JWT
    user.resetPasswordToken = token;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 mins

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetPasswordToken: token,
    });

  } catch (error) {
    next(error);
  }
};


export const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Send OTP email
    const code = await SendVerificationCode(email);

    if (!code) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code.",
      });
    }

    // Save OTP
    user.resetPasswordToken = String(code);
    user.resetCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};