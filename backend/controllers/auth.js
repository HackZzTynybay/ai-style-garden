
const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      companyId, 
      employeesCount 
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create or find company
    let company = await Company.findOne({ companyId });
    if (!company) {
      company = await Company.create({
        name: `${firstName}'s Company`, // Default name, can be updated later
        companyId,
        employeesCount
      });
    }

    // Create user without password initially
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      company: company._id,
      password: crypto.randomBytes(10).toString('hex') // Temporary password
    });

    // Get email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;
    
    const message = `
      You are receiving this email because you need to confirm your email address. Please click the link below to verify:
      \n\n${verificationUrl}\n\n
      If you did not create this account, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Email could not be sent'
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Email verification failed'
    });
  }
};

// @desc    Create password after email verification
// @route   PUT /api/auth/create-password
// @access  Public
exports.createPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

    // Set the new password
    user.password = password;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Could not create password'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User with that email does not exist'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      });
    }

    // Get verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;
    
    const message = `
      You are receiving this email because you need to confirm your email address. Please click the link below to verify:
      \n\n${verificationUrl}\n\n
      If you did not create this account, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Verification email resent'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Email could not be sent'
    });
  }
};

// @desc    Update email
// @route   PUT /api/auth/update-email
// @access  Public
exports.updateEmail = async (req, res, next) => {
  try {
    const { currentEmail, newEmail } = req.body;

    // Find the user
    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Update email and reset verification status
    user.email = newEmail;
    user.isEmailVerified = false;
    
    // Get verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;
    
    const message = `
      You are receiving this email because you need to confirm your new email address. Please click the link below to verify:
      \n\n${verificationUrl}\n\n
      If you did not request this change, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Email updated and verification email sent'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Email could not be updated'
    });
  }
};

// @desc    Logout / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
};
