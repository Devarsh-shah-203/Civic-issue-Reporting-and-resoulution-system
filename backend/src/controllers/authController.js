import jwt from "jsonwebtoken";

import {
    registerUser,
    loginUser
} from "../services/userService.js";


import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/generateToken.js";



// Register

export const register = async(req,res)=>{

    try{

        const user = await registerUser(req.body);


        res.status(201).json({
            message:"User registered successfully",
            user
        });


    }catch(error){

        res.status(400).json({
            message:error.message
        });

    }

};





// Login

export const login = async(req,res)=>{


    try{

        const user = await loginUser(req.body);


        const accessToken =
        generateAccessToken(user._id,user.email);


        const refreshToken =
        generateRefreshToken(user._id);



        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly:true,
                secure:false,
                sameSite:"strict",
                maxAge:
                7*24*60*60*1000
            }
        );



        res.json({

            message:"Login successful",

            accessToken,

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });



    }catch(error){

        res.status(401).json({
            message:error.message
        });

    }

};





// Refresh Token

export const refreshToken=(req,res)=>{


    const token=req.cookies.refreshToken;


    if(!token){

        return res.status(401).json({
            message:"No refresh token"
        });

    }


    try{


        const decoded =
        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );



        const accessToken =
        generateAccessToken(decoded.id);



        res.json({
            accessToken
        });



    }catch(error){

        res.status(403).json({
            message:"Invalid refresh token"
        });

    }

};




// Logout

export const logout=(req,res)=>{


    res.clearCookie("refreshToken");


    res.json({
        message:"Logout successful"
    });

};