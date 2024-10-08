import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import GoogleUser from '../models/googleModel.js'; // Ensure correct model import

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5050/auth/google/callback",
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in the database
    const existingUser = await GoogleUser.findOne({ googleId: profile.id });

    if (existingUser) {
      // If the user exists, return the existing user
      return done(null, existingUser);
    }

    // If the user doesn't exist, create a new user
    const newGoogleUser = new GoogleUser({
      googleId: profile.id,
      name: profile.displayName || '',  // Handle cases where displayName might be undefined
      email: profile.emails[0].value || '', // Handle cases where emails might be undefined
      profilePic: profile._json.picture || '' // Handle cases where profilePic might be undefined
    });

    await newGoogleUser.save();
    return done(null, newGoogleUser);
  } catch (error) {
    console.error('Error in Google OAuth:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await GoogleUser.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

export default passport;
