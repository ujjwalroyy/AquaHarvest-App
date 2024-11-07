import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    index: { expires: '5m' },
    required: true,
  },

}, { timestamps: true });

const TempUserModel = mongoose.model('TempUser', tempUserSchema);

export default TempUserModel;
