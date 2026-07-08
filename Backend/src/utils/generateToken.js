import jwt from "jsonwebtoken";

const resetToken =  (id) => {
  return jwt.sign({id}, process.env.RESET_JWT_SECRET, {
     expiresIn: process.env.RESET_TOKEN_EXPIRY ,
}); };

const generateAccessToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.ACCESS_JWT_SECRET, {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY ,
  }); };

  const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_JWT_SECRET, {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY ,
  }); };

export {generateAccessToken,generateRefreshToken,resetToken};


