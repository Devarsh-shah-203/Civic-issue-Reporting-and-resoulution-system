import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Refresh Token
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "No refresh token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const accessToken = generateAccessToken(decoded.id);

    res.json({
      accessToken,
    });
  } catch (error) {
    res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out successfully",
  });
};