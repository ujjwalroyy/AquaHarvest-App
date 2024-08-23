import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary';
import TempUserModel from '../utils/TempUserModel.js';
import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv'
import passport from '../config/auth.js'
import TempOtpModel from "../utils/TempOtp.js";

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


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
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

    const otp = generateOTP();
    console.log("generate otp: ", otp)

    try {
      await sendOTPPhoneNumber(phone, otp);
      console.log(`OTP sent to ${phone}`);

      await TempUserModel.create({
        name,
        email,
        password,
        phone,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000, 
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

    // Find the temporary OTP record
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

    // Optionally, you can find and delete the user from TempUserModel if needed
    await TempUserModel.deleteOne({ phone });

    // Find the existing user
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
      // address: tempUser.address,
      // city: tempUser.city,
      // country: tempUser.country,
      phone: tempUser.phone,
      // answer: tempUser.answer,
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

export const googleAuthCallbackController = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
    res.redirect('/profile'); 
  });
};

export const googleLogoutController = (req, res) => {
  req.logout((err) => {
    if (err) return next(err); 
    res.redirect('/'); 
  });
};


// export const registerController = async (req, res) => {
//   try {
//     const { name, email, password, address, city, country, phone, answer } = req.body;
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !address ||
//       !city ||
//       !country ||
//       !phone ||
//       !answer
//     ) {
//       return res.status(400).send({
//         success: false,
//         message: "Please Provide All Fields",
//       });
//     }

//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send({
//         success: false,
//         message: "Email already taken",
//       });
//     }

//     const otp = generateOTP();

//     try {
//       await sendOTPEmail(email, otp);
//       console.log(`OTP sent to ${email}`);
//     } catch (error) {
//       return res.status(500).send({
//         success: false,
//         message: "Failed to send OTP email",
//         error,
//       });
//     }

//     const user = await userModel.create({
//       name,
//       email,
//       password,
//       address,
//       city,
//       country,
//       phone,
//       answer,
//       otp, 
//       otpExpires: Date.now() + 10 * 60 * 1000 
//     });

//     res.status(201).send({
//       success: true,
//       message: "OTP sent to your email. Please verify to complete registration.",
//       user: { email: user.email, _id: user._id }, 
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In Register API",
//       error,
//     });
//   }
// };

// export const verifyOtpController = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).send({
//         success: false,
//         message: "Please provide email and OTP",
//       });
//     }

//     const user = await userModel.findOne({ email, otp });
//     if (!user) {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid OTP or email",
//       });
//     }

//     if (Date.now() > user.otpExpires) {
//       return res.status(400).send({
//         success: false,
//         message: "OTP has expired. Please register again.",
//       });
//     }

//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "OTP verified successfully. Registration complete.",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In OTP Verification",
//       error,
//     });
//   }
// };


// export const registerController = async (req, res) => {
//   try {
//     const { name, email, password, address, city, country, phone, answer } = req.body;
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !address ||
//       !city ||
//       !country ||
//       !phone || !answer
//     ) {
//       return res.status(500).send({
//         success: false,
//         message: "Please Provide All Fields",
//       });
//     }

//     //existing user
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(500).send({
//         success: false,
//         message: "email already taken",
//       });
//     }

//     const user = await userModel.create({
//       name,
//       email,
//       password,
//       address,
//       city,
//       country,
//       phone,
//       answer
//     });
//     res.status(201).send({
//       success: true,
//       message: "Registration success, please login",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In Register API",
//       error,
//     });
//   }
// };

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    
    
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Add Email or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
    const token = user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure:process.env.NODE_ENV === "development"?true:false,
        httpOnly:process.env.NODE_ENV === "development"?true:false,
        sameSite:process.env.NODE_ENV === "development"?true:false,
      })
      .send({
        success: true,
        message: "Login Successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error In Login Api",
      error,
    });
  }
};




//Get user profile
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

//logout
export const logoutController = async (req, res) =>{
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure:process.env.NODE_ENV === "development"?true:false,
            httpOnly:process.env.NODE_ENV === "development"?true:false,
            sameSite:process.env.NODE_ENV === "development"?true:false,
          }).send({
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

//update profile
export const updateProfileController = async(req, res) =>{
    try {
        const user = await userModel.findById(req.user._id)
        const {name, email, address, city, country, phone} = req.body
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone
        //save
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

// update user password
export const updatePasswordController = async (req, res) =>{
    try {
      const user = await userModel.findById(req.user._id)
      const {oldPassword, newPassword} = req.body
      //validation
      if(!oldPassword || !newPassword){
        return res.status(500).send({
          success: false,
          message: 'please provide old or new password',
        })
      }
      const isMatch = await user.comparePassword(oldPassword)
      //validation
      if(!isMatch){
        return res.status(500).send({
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

//Update user profile
export const updateProfilePic = async(req, res) => {
    try {
      const user = await userModel.findById(req.user._id)
      //get file grom user
      const file = getDataUri(req.file)
      //delete prev image
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
      //update
      const cdb = await cloudinary.v2.uploader.upload(file.content)
      user.profilePic = {
        public_id: cdb.public_id,
        url: cdb.secure_url
      }
      //save
      await user.save()
      res.status(200).send({
        success: true,
        message: "profile picture updated"
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
      return res.status(404).send({
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

