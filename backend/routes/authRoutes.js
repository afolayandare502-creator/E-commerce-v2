const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  requestOtp,
  verifyOtp,
  loginUser,
  googleAuthCallback,
} = require('../controllers/authController');

// Standard Auth Routes
router.post('/login', loginUser);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=true', session: false }),
  googleAuthCallback
);

module.exports = router;
