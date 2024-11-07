import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary';
import TempUserModel from '../utils/TempUserModel.js';
import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv'
import passport from '../config/auth.js'
import TempOtpModel from "../utils/TempOtp.js";
import axios from "axios";

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export const resetPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide a phone number",
      });
    }

    const otp = generateOTP();
    console.log("Generated OTP: ", otp);

    try {
      await sendOTPPhoneNumber(phone, otp);
      console.log(`OTP sent to ${phone}`);

      await TempOtpModel.create({
        phone,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      console.error('Failed to send OTP SMS:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP SMS.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Error in reset password process:', error);
    res.status(500).json({
      success: false,
      message: "Error in reset password process.",
      error: error.message,
    });
  }
};

async function sendOTPPhoneNumber(userPhone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: userPhone,
    });
    console.log('OTP sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}
async function sendOTPPhoneNumberRegister(userPhone, otp) {
  try {
    const username = process.env.SMS_API_USERNAME;
    const password = process.env.SMS_API_PASSWORD;    
    const apiUrl = `http://web.smsgw.in/smsapi/httpapi.jsp?username=${username}&password=${password}&from=CENUNI&to=${userPhone}&text=Dear Candidate, Your verification code is: ${otp}, Use the following code to verify your account. Centurion University&coding=0&pe_id=1001349507132979670&template_id=1007921784252726317`;
    
    const response = await axios.get(apiUrl);
    console.log('OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already taken.",
      });
    }

    const existingTempUser = await TempUserModel.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({
        success: false,
        message: "OTP has already been sent to this email. Please verify or wait for the OTP to expire.",
      });
    }

    const otp = generateOTP();
    console.log("Generated OTP: ", otp);

    try {
      await sendOTPPhoneNumberRegister(phone, otp);
      console.log(`OTP sent to ${phone}`);

      await TempUserModel.create({
        name,
        email,
        password,
        phone,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000, 
      });

      res.status(200).json({
        success: true,
        message: "OTP sent to your phone. Please verify to complete registration.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP SMS.",
        error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in registration process.",
      error,
    });
  }
};


export const verifyForgetOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide both phone number and OTP.",
      });
    }

    const tempOtp = await TempOtpModel.findOne({ phone, otp });

    if (!tempOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or phone number.",
      });
    }

    if (Date.now() > tempOtp.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    await TempUserModel.deleteOne({ phone });

    const existingUser = await userModel.findOne({ phone });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      user: { phone: existingUser.phone, _id: existingUser._id },
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({
      success: false,
      message: "Error in OTP verification process.",
      error: error.message,
    });
  }
};


export const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide both phone number and OTP.",
      });
    }

    const tempUser = await TempUserModel.findOne({ phone, otp });
    
    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or phone number.",
      });
    }

    if (Date.now() > tempUser.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const existingUser = await userModel.findOne({ email: tempUser.email, phone:tempUser.phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const user = await userModel.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      isVerified: true,
    });

    await TempUserModel.deleteOne({ phone });

    res.status(201).json({
      success: true,
      message: "OTP verified successfully. Registration complete.",
      user: { phone: user.phone, _id: user._id },
      
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({
      success: false,
      message: "Error in OTP verification process.",
      error,
    });
  }
};

export const googleAuthController = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleAuthCallbackController = async (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' })(req, res, async () => {
    try {
      const user = req.user;

      let existingUser = await User.findOne({ googleId: user.id });
      if (!existingUser) {
        existingUser = new User({
          googleId: user.id,
          email: user.emails[0].value,
          name: user.displayName
        });
        await existingUser.save();
      }


      res.redirect('/profile'); 
    } catch (error) {
      next(error);
    }
  });
};

export const googleLogoutController = (req, res) => {
  req.logout((err) => {
    if (err) return next(err); 
    res.redirect('/'); 
  });
};

export const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please add Phone no. and password.",
      });
    }

    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production", 
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        success: true,
        message: "Login successful.",
        token,
        user,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in login API.",
      error: error.message,
    });
  }
};

export const getUserProfileController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "User profile fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In Profile API',
            error
        })
        
    }
}

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); 

    if (!users || users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message || error,
    });
  }
};

export const logoutController = async (req, res) =>{
  console.log('Logout request:', req.body);
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "production", 
            httpOnly: true,
        sameSite: 'strict',
          }).json({
            success:true,
            message:"Logout Successfully"
          })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In Logout API',
            error
        })
        
    }
}

export const updateProfileController = async(req, res) =>{
    try {
        const user = await userModel.findById(req.user._id)
        console.log("UserId: ", req.user._id);
        console.log('Received data to update profile:', req.body);
        
        if (!user) {
          return res.status(404).send({
              success: false,
              message: 'User not found'
          });
      }
        const {name, email, state, city, country, phone, dob} = req.body

        if(name) user.name = name
        if(email) user.email = email
        if(state) user.state = state
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone
        if (dob) {
          const [day, month, year] = dob.split('/');
          
          const parsedDob = new Date(`${year}-${month}-${day}`);
          
          if (isNaN(parsedDob.getTime())) {
            return res.status(400).send({
              success: false,
              message: 'Invalid date format for dob, expected DD/MM/YYYY',
            });
          }
          
          const formattedDob = parsedDob.toISOString().split('T')[0]; 
          
          user.dob = formattedDob; 
        }
        
        console.log("Updating user:", user);
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User Profile Updated'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In update profile API',
            error
        })
    }
}

export const updatePasswordController = async (req, res) =>{
    try {
      const user = await userModel.findById(req.user._id)
      if (!user) {
        return res.status(404).send({
            success: false,
            message: 'User not found'
        });
    }
      const {oldPassword, newPassword} = req.body
      if(!oldPassword || !newPassword){
        return res.status(500).send({
          success: false,
          message: 'please provide old or new password',
        })
      }
      const isMatch = await user.comparePassword(oldPassword)
      if(!isMatch){
        return res.status(400).send({
          success: false,
          message: 'Invalid old Password'
        })
      }
      user.password = newPassword
      await user.save()
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully",
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message:'Error In Logout API',
          error
      })
    }
}

export const updateProfilePic = async(req, res) => {
    try {
      console.log('Uploaded file:', req.file);
      const user = await userModel.findById(req.user._id)
      if (!user) {
        return res.status(404).send({
            success: false,
            message: 'User not found'
        });
    }
    if (!req.file) {
      return res.status(400).send({
          success: false,
          message: 'No file uploaded',
      });
  }

      const file = getDataUri(req.file)
      if (user.profilePic?.public_id) {
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
      }
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      user.profilePic = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };
      console.log("Cloudinary upload response:", cdb);
      await user.save();
      res.status(200).send({
        success: true,
        message: "Profile picture updated",
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message:'Error In Logout API',
          error
      })
    }
}

export const passwordResetController = async(req, res) => {
  try {
    const {email, newPassword, answer} = req.body
    if(!email || ! newPassword || !answer){
      return res.status(500).send({
        success: false,
        message: 'Please Provide all field'
      })
    }
    const user = await userModel.findOne({email, answer})
    if(!user){
      return res.status(400).send({
        success:false,
        message:'Invalid user or answer'
      })
    }
    user.password = newPassword
    await user.save()
    res.status(200).send({
      success:true,
      message:"Your password has been reset please login"
    })
  } catch (error) {
    console.log(error);
      res.status(500).send({
          success: false,
          message:'Error In password reset API',
          error
      })
  }
}

export const searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const filteredUsers = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },   
        { id: query }                           
      ]
    });
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
};