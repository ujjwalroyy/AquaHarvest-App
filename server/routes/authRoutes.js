import express from 'express';
import { googleAuthController, googleAuthCallbackController, googleLogoutController } from '../controllers/userController.js';
import '../config/auth.js'
const router = express.Router();
import passport from 'passport'
import { failureGoogleLogin, successGoogleLogin } from '../controllers/authController.js';



router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect:'/success',
    failureRedirect:'/failure'
}))

router.get('/success', successGoogleLogin)

router.get('/failure', failureGoogleLogin)


export default router;


