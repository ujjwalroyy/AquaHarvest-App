import passport from '../config/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const googleAuthController = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleAuthCallbackController = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/failure' }, (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      return res.redirect('/failure'); 
    }

    try {
      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/profile'); 
    } catch (error) {
      console.error('Token generation error:', error);
      next(error);
    }
  })(req, res, next);
};

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

export const failureGoogleLogin = (req, res) => {
  res.status(404).send('Authentication failed. Please try again.');
};

export const successGoogleLogin = (req, res) => {
  res.send('Authentication successful.');
};
