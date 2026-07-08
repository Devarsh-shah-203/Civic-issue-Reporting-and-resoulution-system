import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import {generateAccessToken,generateRefreshToken} from '../utils/generateToken.js'

//const generateToken = (id, username) => {
// return jwt.sign({ id, username }, process.env.JWT_SECRET, {
//    expiresIn: "24h",
//  }); };

const register = async (req, res, next) => {
  try {
    
    let { username, email, password, phone, BillingAddress } = req.body;

    if (
      !username?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !phone?.trim()
    ) {
      // to prevent username: "    " from passing
      return res.status(400).json({
        success: false,
        message: "Please provide username, email,phone,and password  ",
      });
    }

    email = email.toLowerCase().trim();
    username = username.trim();


    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message:
          existingUser.username == username
            ? "Username already Taken"
            : "email Already registared",
      });
    }


    const user = await User.create({
      username,
      email,
      password,
      phone,
      BillingAddress,
    });

    const refreshToken = generateRefreshToken(user._id);
    const accessToken = generateAccessToken(user._id, user.username);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: {
        username: user.username,
        email: user.email,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
    try{
  //const { username, email, password } = req.body;
        const {identity,password}=req.body; // in ui for identity client will see username or email but req body will contain identity

  if (!identity?.trim() || !password?.trim()) {
    // to prevent username: "    " from passing
    return res.status(400).json({
      success: false,
      message: "Please provide username or email and password  ",
    });
  }

  const user = await  User.findOne({$or : [{username:identity},{email:identity}]}).select("+password");

  if(!user){
    return res.status(404).json({
        success:false,
        message:"NO user Found.Please Register First"
    })
  }

  const isCorrectPassword = await bcrypt.compare(password,user.password) // returns true or false // syntax bcrypt.compare(plainPassword, hashedPassword)

  if(!isCorrectPassword && user.loginAttempts>=4){ // max 4 attempts
    return res.status(401).json({
        success:false,
        message:"Too Many Failed Login Attempts,Please reset password",
        LoginAttempts:user.loginAttempts
        // in UI client sees forgot password button which leads to forgot password route ..
    });
  }


  if(!isCorrectPassword){
     user.loginAttempts+=1;
     await user.save();

    return res.status(401).json({
        success:false,
        message:"Password is incorrect"
    })

  }

  const refreshToken = generateRefreshToken(user._id);
  const accessToken = generateAccessToken(user._id, user.username);
  
  user.refreshToken=refreshToken;
  user.loginAttempts=0;
  user.lastLogin = Date.now();
  await user.save();

  user.password = undefined;

  res.status(200).json({
    success:true,
    message:"Login Successfull",
    data:{
        username:user.username,
        email:user.email,
        accessToken
    }
  })
}
catch(error){
    next(error);
}

};

const logout = async (req,res,next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: "",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
       next(error);
    }
};


export {register,login,logout};