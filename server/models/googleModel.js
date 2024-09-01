import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String,
    required: false
  }
});

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

export default GoogleUser;