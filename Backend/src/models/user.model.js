import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      min: [1, "username should be more than 1 character"],
      max: [15, "username should not be more than 15 characters long"],
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 4,
      select: false,
    },

    phone: {
      type: String,
      min: [10, "phone number should  be more than 10 characters long"],
      max: [10, "phone number should not be more than 10 characters long"],
      default: null,
    },

    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    plan: {
      type: String,
      enum: ["free", "Pro", "Enterprise"],
      default: "free",
    },

    APIkey: {
      type: String,
     // required: true,
      unique: true,
    },

    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },

    BillingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    Usage: {

      monthlyTokens: {
        type: Number,
        default: 100000, // for free users
      },

      tokensUsed:{
        type:Number,
        default:0
      },


    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lastLogin: {
      type: Date,
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
  },
  { timestamps: true },
);

// to hash the password before saving or to always hash before saving when called fromm any controller
userschema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


//hashing API key
userschema.pre("save", async function () {
    if (!this.isModified("APIkey")) return;
  
    const salt = await bcrypt.genSalt(10);
    this.APIkey = await bcrypt.hash(this.APIkey, salt);
  });


const User = mongoose.model("user", userschema);

export default User;
