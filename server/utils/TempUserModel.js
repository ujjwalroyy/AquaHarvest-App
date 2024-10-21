import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
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

const TempUserModel = mongoose.model('TempUser', tempUserSchema);

export default TempUserModel;
