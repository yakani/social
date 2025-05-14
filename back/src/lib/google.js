import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import passportGoogleOidc from 'passport-google-oidc'; // This must be at the very top
const GoogleStrategy = passportGoogleOidc.Strategy;
import User from "../models/user.model.js"
 passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret:process.env.clientSecret,
    callbackURL: "http://localhost:7000/auth/google/callback",
    scope: ['profile', 'email']
  },
  async function(issuers, profile, done) {
    const email = profile.emails[0].value;
    let user = await User.findOne({email}) ;
  
   if(!user){
    user = await User.create({
      email,
      name: profile.displayName,
      password:"password",
    
    });
   }
    done(null, user);
  }));
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, user);
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });