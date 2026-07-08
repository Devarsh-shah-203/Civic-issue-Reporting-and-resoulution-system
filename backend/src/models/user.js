import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },


    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },


    password:{
        type:String,
        required:true,
        minlength:6
    },


    role:{
        type:String,
        enum:[
            "citizen",
            "admin",
            "worker"
        ],
        default:"citizen"
    },

    passwordChangedAt: {
        type: Date,
      },
  
      resetPasswordToken: {
        type: String,
        select: false,
      },
  
      resetCodeExpiry: {
        type:Date,
      },
  
      refreshToken:{
          type:String,
          select:false
      },




},{
    timestamps:true
});



export default mongoose.model(
    "User",
    userSchema
);