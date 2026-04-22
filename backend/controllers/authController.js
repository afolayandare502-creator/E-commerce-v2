const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Request OTP for registration verification
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOtp = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
       return res.status(400).json({ message: 'Account already exists. Please sign in.' });
    }

    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
        password,
        isVerified: false,
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Casa Login Code',
      text: `Your login code is: ${otpCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Casa Login</h2>
          <p>Your one-time login code is:</p>
          <h1 style="letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 15px; border-radius: 5px; display: inline-block;">${otpCode}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Error in requestOtp:', error);
    res.status(500).json({ message: 'Server error asking for OTP' });
  }
};

// @desc    Auth user & get token directly via password
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && !user.password) {
      return res.status(400).json({ message: 'Login via Google instead' });
    }

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Account not verified. Please register again to get a new code.' });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Success! Clear OTP and mark as verified
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// @desc    Handle google callback and issue JWT
exports.googleAuthCallback = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Issue our own JWT token
  const token = generateToken(req.user._id, req.user.role);

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';

  // Decide where to redirect the user to finish login
  // You can pass the token as a query param or set it in a cookie
  // For frontend integration, redirecting with a query param or fragment is common
  res.redirect(`${FRONTEND_URL}/Pages/login.html?token=${token}&email=${encodeURIComponent(req.user.email)}&name=${encodeURIComponent(req.user.firstName)}`);
};
