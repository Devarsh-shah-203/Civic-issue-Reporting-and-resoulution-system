import User from "../models/user.js";

import {
    hashPassword,
    comparePassword
} from "./authService.js";




// Register

export const registerUser = async(data)=>{


    const {
        name,
        email,
        password
    } = data;



    const existingUser =
    await User.findOne({email});


    if(existingUser){

        throw new Error(
            "User already exists"
        );

    }



    const hashedPassword =
    await hashPassword(password);



    const user =
    await User.create({

        name,

        email,

        password:hashedPassword

    });



    return user;

};






// Login


export const loginUser = async(data)=>{


    const {
        email,
        password
    } = data;



    const user =
    await User.findOne({
        email
    }).select("+password");



    if(!user){

        throw new Error(
            "Invalid email or password"
        );

    }



    const match =
    await comparePassword(
        password,
        user.password
    );



    if(!match){

        throw new Error(
            "Invalid email or password"
        );

    }



    return user;

};