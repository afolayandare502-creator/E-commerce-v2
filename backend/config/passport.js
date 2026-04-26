const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: (process.env.BACKEND_URL || 'http://localhost:5001') + '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // If user exists but doesn't have googleId, update them
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true; // Auto verify if they login with Google
            await user.save();
          }
        } else {
          // Create new user
          const nameParts = profile.displayName.split(' ');
          const firstName = profile.name?.givenName || nameParts[0];
          const lastName = profile.name?.familyName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
          
          user = await User.create({
            googleId: profile.id,
            firstName: firstName,
            lastName: lastName,
            email: profile.emails[0].value,
            isVerified: true, // Auto verify for Google users
          });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We don't necessarily need serialize/deserialize if we are using JWT tokens
// But adding them just in case Passport complains in certain configurations
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
