const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require('../controllers/residentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../config/multer');

// ── Validation ────────────────────────────────────────────────────────────────

const updateValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2‑100 characters'),
  body('phone').optional().trim(),
  body('flatNumber').optional().trim().notEmpty().withMessage('Flat number cannot be empty'),
  body('role').optional().isIn(['resident', 'admin']).withMessage('Invalid role'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

router.use(protect);

router.get('/', authorize('admin'), getResidents);

router.route('/:id')
  .get(getResidentById)                                    // admin or own profile
  .put(upload.single('profileImage'), updateValidation, updateResident)
  .delete(authorize('admin'), deleteResident);

module.exports = router;
