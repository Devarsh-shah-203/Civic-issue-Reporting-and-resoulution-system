import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

const reset = async (req, res, next) => {
  try{
  const { resetToken, password } = req.body;

  if ( !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide new password",
    });
  }

  const decoded = jwt.verify(resetToken , process.env.RESET_JWT_SECRET);
  

  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.password = password;
  user.passwordChangedAt=Date.now();
  user.loginAttempts=0;
  await user.save();

  res.status(200).json({
    success:true,
    message:"Password Reset successfully", // frontend redirect to login page
  })
}catch(error){
    next(error)
}
};


export default reset;