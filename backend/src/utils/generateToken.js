import jwt from "jsonwebtoken";

export const generateAccessToken = (id,email,role) => {
  return jwt.sign(
    { id,email,role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const resetToken =  (id) => {
  return jwt.sign({id}, process.env.RESET_JWT_SECRET, {
     expiresIn: process.env.RESET_TOKEN_EXPIRY ,
}); };
