const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../config/multer');

// ── Validation ────────────────────────────────────────────────────────────────

const createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5, max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 5000 }),
  body('type').optional().isIn(['general', 'meeting', 'payment', 'alert', 'event']).withMessage('Invalid type'),
  body('priority').optional().isIn(['normal', 'important']).withMessage('Invalid priority'),
];

const updateValidation = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 5000 }),
  body('type').optional().isIn(['general', 'meeting', 'payment', 'alert', 'event']).withMessage('Invalid type'),
  body('priority').optional().isIn(['normal', 'important']).withMessage('Invalid priority'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

router.use(protect); // all notice routes require authentication

router.route('/')
  .get(getNotices)                                         // all authenticated users
  .post(authorize('admin'), upload.single('attachment'), createValidation, createNotice);

router.route('/:id')
  .put(authorize('admin'), upload.single('attachment'), updateValidation, updateNotice)
  .delete(authorize('admin'), deleteNotice);

module.exports = router;
