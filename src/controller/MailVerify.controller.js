import User from "../models/user.model.js";
import { resetToken as generateResetToken } from "../utils/generateToken.js";
import SendVerificationCode from "../utils/Sendmail.js";

const verify = async (req, res, next) => {
  try {
    const { email, OTP } = req.body; // email stored in cookies

    const user = await User.findOne({ email: email });

    const code = user.resetPasswordToken;

    const resetToken = generateResetToken(user._id);

    //to check expiry of otp
    if (Date.now() > user.resetCodeExpiry) {
      return res.status(401)({
        success: true,
        message: "Code Expired", // ui will have button to send mail again
      });
    }

    if (OTP === code) {
      user.resetPasswordToken = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Code verified",
        resetToken, // frontend get this message and redirect to reset password page along with resetToken value
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid code",
      });
    }
  } catch (error) {
    next(error);
  }
};

const Mail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    const code = await SendVerificationCode(email);

    user.resetPasswordToken = code;
    user.resetCodeExpiry = Date.now() + 1000 * 60 * 5; // 5min expiration
    await user.save();

    res.status(200).json({
      success: true,
      message: "Verification Code sent successfully", // ui redirects to otp verify page
    });
  } catch (error) {
    next(error);
  }
};

export { verify, Mail };
