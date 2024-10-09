import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
export const isAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. Please log in.",
            redirectToLogin: true, 
        });
    }

    try {
        console.log("Token received for verification:", token);
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token data:", decodeData);

        req.user = await userModel.findById(decodeData._id);
        console.log("User found in database:", req.user);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please log in.",
                redirectToLogin: true,  
            });
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
                redirectToLogin: true,  
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token. Please log in again.",
            redirectToLogin: true,  
        });
    }
};


export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "admin only",
      });
    }
    next();
  };