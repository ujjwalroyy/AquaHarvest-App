import mongoose from 'mongoose';

const tempOtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const TempOtpModel = mongoose.model('TempOtp', tempOtpSchema);

export default TempOtpModel;