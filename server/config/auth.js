import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import GoogleUser from '../models/googleModel.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://192.168.43.60:5050/auth/google/callback",
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await GoogleUser.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newGoogleUser = new GoogleUser({
      googleId: profile.id,
      name: profile.displayName || '',  
      email: profile.emails[0].value || '', 
      profilePic: profile._json.picture || '' 
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
