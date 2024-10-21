import express from 'express';
import { 
  getAllUsersController,
  getUserProfileController, 
  loginController, 
  logoutController, 
  passwordResetController, 
  registerController, 
  resetPassword, 
  searchUsers, 
  updatePasswordController, 
  updateProfileController, 
  updateProfilePic, 
  verifyForgetOtpController, 
  verifyOtpController 
} from '../controllers/userController.js';
import { isAuth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', registerController);

router.post('/register/verify', verifyOtpController);

router.get('/get-all-user', getAllUsersController)

router.post('/signin', loginController);

router.get('/profile', isAuth, getUserProfileController);

router.post('/logout', isAuth, logoutController);

router.put('/profile-update', isAuth, updateProfileController);

router.put('/update-password', isAuth, updatePasswordController);

router.put('/profile-picture', isAuth, singleUpload, updateProfilePic);

router.get('/reset-password', passwordResetController);

router.post('/send-otp', resetPassword);

router.post('/verify-forgot-otp', verifyForgetOtpController)

router.get('/search', searchUsers)

export default router;
