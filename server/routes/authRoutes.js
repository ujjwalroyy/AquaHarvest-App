import express from 'express';
import { googleAuthController, googleAuthCallbackController, googleLogoutController } from '../controllers/userController.js';

const router = express.Router();

router.get('/auth/google', googleAuthController);
router.get('/auth/google/callback', googleAuthCallbackController);
router.get('/auth/logout', googleLogoutController);

export default router;


