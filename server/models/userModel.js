import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be > 6 char"],
    },
    
    country: {
      type: String,
      // required: [true, "country name is required"],
    },
    state:{
      type:String,
    },
    city: {
      type: String,
      // required: [true, "city name is required"],
    },
    phone: {
      type: String,
      unique: [true, "phone number is already taken"],
      required: [true, "phone no is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    dob: Date,
    answer: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password during login
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// JWT Token
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const userModel = mongoose.model("Users", userSchema);
export default userModel;
