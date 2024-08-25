import passport from '../config/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Initiates the Google OAuth flow
export const googleAuthController = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Handles the Google OAuth callback
export const googleAuthCallbackController = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/failure' }, (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      return res.redirect('/failure'); // Redirect to failure route if no user found
    }

    try {
      const token = generateToken(user);
      // Send token to the client and redirect
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/profile'); // Redirect to a profile page or some other page
    } catch (error) {
      console.error('Token generation error:', error);
      next(error);
    }
  })(req, res, next);
};

// Logs out the user
export const googleLogoutController = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    res.clearCookie('token');
    res.redirect('/');
  });
};

// Handles failed authentication
export const failureGoogleLogin = (req, res) => {
  res.status(404).send('Authentication failed. Please try again.');
};

// Handles successful authentication
export const successGoogleLogin = (req, res) => {
  res.send('Authentication successful.');
};
