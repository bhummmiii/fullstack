const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// ── Validation ────────────────────────────────────────────────────────────────

const createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5, max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 2000 }),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['water', 'electricity', 'cleanliness', 'parking', 'security', 'maintenance', 'noise', 'other'])
    .withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
];

const updateValidation = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
  body('category')
    .optional()
    .isIn(['water', 'electricity', 'cleanliness', 'parking', 'security', 'maintenance', 'noise', 'other'])
    .withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['Open', 'In Progress', 'Resolved']).withMessage('Invalid status'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

router.use(protect); // all complaint routes require authentication

router.route('/')
  .get(getComplaints)
  .post(upload.array('attachments', 3), createValidation, createComplaint);

router.route('/:id')
  .get(getComplaintById)
  .put(updateValidation, updateComplaint)
  .delete(deleteComplaint);

module.exports = router;
