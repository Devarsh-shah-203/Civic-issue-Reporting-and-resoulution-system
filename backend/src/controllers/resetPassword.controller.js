import jwt from "jsonwebtoken";
import User from "../models/user.js";

const resetPassword = async (req, res, next) => {
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reset token and password are required.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      resetPasswordToken,
      process.env.RESET_JWT_SECRET
    );
    console.log(decoded)

    // Check DB
    const user = await User.findOne({
      _id: decoded.id,
      //resetPasswordToken,
    });

    console.log(user)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    if (Date.now() > user.resetCodeExpiry) {
      user.resetPasswordToken = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Reset token has expired.",
      });
    }

    // Pre-save middleware will hash the password
    user.password = password;
    user.passwordChangedAt = Date.now();

    // Remove token after successful reset
    user.resetPasswordToken = undefined;
    user.resetCodeExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    next(error);
  }
};

export default resetPassword;