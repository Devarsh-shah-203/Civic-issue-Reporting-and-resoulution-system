import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.',
      });
    }


    const token = authHeader.split(' ')[1];
    
  // console.log("\n Token:", token);
  //  console.log("\n Parts:", token.split(".").length);

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
   //console.log("\n Decoded Token:", decoded);
    // Find user by username (not _id)
    const user = await User.findOne({ username: decoded.username }).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } 
  catch (error) {

    //console.log("\n Error name:", error.name);
    //console.log("\n Error message:", error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

export default authenticate;
