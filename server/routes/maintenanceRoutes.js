const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createMaintenance,
  getMaintenanceRecords,
  getResidentMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ── Validation ────────────────────────────────────────────────────────────────

const createValidation = [
  body('residentId').notEmpty().withMessage('Resident ID is required').isMongoId().withMessage('Invalid resident ID'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('month').trim().notEmpty().withMessage('Month is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
];

const updateValidation = [
  body('status').optional().isIn(['Paid', 'Unpaid', 'Overdue']).withMessage('Invalid status'),
  body('paymentDate').optional().isISO8601().withMessage('Invalid payment date'),
  body('paymentMethod')
    .optional()
    .isIn(['UPI', 'Bank Transfer', 'Cash', 'Cheque'])
    .withMessage('Invalid payment method'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be positive'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

router.use(protect);

router.route('/')
  .get(getMaintenanceRecords)                              // admin: all; resident: own
  .post(authorize('admin'), createValidation, createMaintenance);

// Resident-specific bill summary (also accessible by admin)
router.get('/:residentId', getResidentMaintenance);

// Admin-only detailed record management
router.put('/:id', authorize('admin'), updateValidation, updateMaintenance);
router.delete('/:id', authorize('admin'), deleteMaintenance);

module.exports = router;
