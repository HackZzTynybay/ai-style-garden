const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

const clientUrl = "https://ai-style-garden.lovable.app"
exports.register = async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber,
      companyDetails 
    } = req.body;

    const {companyId, employeesCount, name} = companyDetails;

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
        name: `${name}'s Company`, // Default name, can be updated later
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
      password: "Manoj@8374"
      // password: crypto.randomBytes(10).toString('hex') // Temporary password
    });

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;

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
    
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Verification email sent',
      additionalMessage: "Email send but verification is not needed for development purposes. will change it later."
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

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      userId: user._id,
      email: user.email
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
    const { userId, password } = req.body;

    const user = await User.findById(userId);

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

    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password created successfully'
    });
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

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

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;
    
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

    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    user.email = newEmail;
    user.isEmailVerified = false;
    
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;
    
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

exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

const sendTokenResponse = (user, statusCode, res) => {
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


exports.getSampleData = (req, res, next)=>{
  res.status(200).json({
    success:true,
    data: {
      message: "Hello Everyone"
    }
  })
}
