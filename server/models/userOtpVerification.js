import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp:{ type:String, required:true,},
    email:{type: String},
    phone:{type: String},
    createdAt: {type: Date, default: Date.now, index:{expires: '5m'}},
    expiresAt: Date
})


export const otpModel = mongoose.model("OTP", otpSchema);
export default otpModel;