const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createVisitor,
  getVisitors,
  updateVisitor,
  deleteVisitor,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

// ── Validation ────────────────────────────────────────────────────────────────

const createValidation = [
  body('visitorName').trim().notEmpty().withMessage('Visitor name is required').isLength({ min: 2, max: 100 }),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+\d\s\-()]{7,20}$/).withMessage('Invalid phone number format'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required').isLength({ max: 500 }),
  body('expectedDate').isISO8601().withMessage('Valid expected date/time is required'),
  body('guestCount').optional().isInt({ min: 1, max: 20 }).withMessage('Guest count must be between 1 and 20'),
];

const updateValidation = [
  body('visitorName').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim().matches(/^[+\d\s\-()]{7,20}$/).withMessage('Invalid phone number format'),
  body('purpose').optional().trim().isLength({ max: 500 }),
  body('expectedDate').optional().isISO8601().withMessage('Invalid date'),
  body('status')
    .optional()
    .isIn(['Pending', 'Approved', 'Rejected', 'checked-in', 'checked-out'])
    .withMessage('Invalid status'),
  body('guestCount').optional().isInt({ min: 1, max: 20 }),
];

// ── Routes ────────────────────────────────────────────────────────────────────

router.use(protect);

router.route('/')
  .get(getVisitors)
  .post(createValidation, createVisitor);

router.route('/:id')
  .put(updateValidation, updateVisitor)
  .delete(deleteVisitor);

module.exports = router;
