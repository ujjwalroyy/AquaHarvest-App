import express from 'express';
import { 
  getUserProfileController, 
  loginController, 
  logoutController, 
  passwordResetController, 
  registerController, 
  resetPassword, 
  updatePasswordController, 
  updateProfileController, 
  updateProfilePic, 
  verifyOtpController 
} from '../controllers/userController.js';
import { isAuth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', registerController);

router.post('/register/verify', verifyOtpController);

router.post('/login', loginController);

router.get('/profile', isAuth, getUserProfileController);

router.get('/logout', isAuth, logoutController);

router.put('/profile-update', isAuth, updateProfileController);

router.put('/update-password', isAuth, updatePasswordController);

router.put('/profile-picture', isAuth, singleUpload, updateProfilePic);

router.get('/reset-password', passwordResetController);

router.post('/send-otp', resetPassword);

router.post('/verify-forgot-otp')

export default router;
