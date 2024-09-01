import express from 'express';
import {
  googleAuthController,
  googleAuthCallbackController,
  googleLogoutController
} from '../controllers/authController.js';


const router = express.Router();

router.get('/google', googleAuthController);

router.get('/google/callback', googleAuthCallbackController);

router.get('/logout', googleLogoutController);

export default router;
