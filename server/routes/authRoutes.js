const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyIdentity,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// ── Validation rules ─────────────────────────────────────────────────────────

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('flatNumber').trim().notEmpty().withMessage('Flat number is required'),
  body('role').optional().isIn(['resident', 'admin']).withMessage('Invalid role'),
  body('phone').optional().trim(),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim(),
  body('flatNumber').optional().trim().notEmpty(),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// ── Routes ───────────────────────────────────────────────────────────────────

// Public
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Forgot password (no auth required)
router.post('/forgot-password/verify', verifyIdentity);
router.post('/forgot-password/reset', resetPassword);

// Protected
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
