const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── Helpers ────────────────────────────────────────────────────────────────

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return null;
};

// ─── @desc    Register a new user (Admin only or first-time seeding)
// ─── @route   POST /api/auth/register
// ─── @access  Admin (protected) — or public if no users exist (first-run seed)
const register = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { name, email, password, phone, flatNumber, role } = req.body;

    // Allow first-run open registration; after that, only admins can register users.
    const userCount = await User.countDocuments();
    if (userCount > 0 && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can register new users',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      flatNumber,
      // First-ever user becomes admin automatically
      role: userCount === 0 ? 'admin' : role || 'resident',
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Login user
// ─── @route   POST /api/auth/login
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { email, password } = req.body;

    // Explicitly select password field (marked select:false in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact the admin.',
      });
    }

    const token = generateToken(user._id.toString());

    // Return user without password
    const userObj = user.toJSON();

    res.status(200).json({
      success: true,
      data: {
        user: userObj,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get current authenticated user's profile
// ─── @route   GET /api/auth/profile
// ─── @access  Private
const getProfile = async (req, res, next) => {
  try {
    // req.user is already populated by authMiddleware (no password)
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update current user's profile
// ─── @route   PUT /api/auth/profile
// ─── @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const allowedFields = ['name', 'phone', 'flatNumber'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Handle profile image if uploaded via multer
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Change password
// ─── @route   PUT /api/auth/change-password
// ─── @access  Private
const changePassword = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hash hook

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Verify identity for password reset (email + flatNumber match)
// ─── @route   POST /api/auth/forgot-password/verify
// ─── @access  Public
const verifyIdentity = async (req, res, next) => {
  try {
    const { email, flatNumber } = req.body;

    if (!email || !flatNumber) {
      return res.status(422).json({
        success: false,
        message: 'Email and flat number are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      flatNumber: flatNumber.trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email and flat number combination',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact the admin.',
      });
    }

    // Return a short-lived JWT scoped only for password reset
    const jwt = require('jsonwebtoken');
    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'Identity verified. You may now reset your password.',
      resetToken,
      userName: user.name,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Reset password using the short-lived reset token
// ─── @route   POST /api/auth/forgot-password/reset
// ─── @access  Public (requires valid resetToken from verifyIdentity)
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(422).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(422).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    let decoded;
    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Reset link has expired or is invalid. Please start over.',
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save bcrypt hash

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, verifyIdentity, resetPassword };
