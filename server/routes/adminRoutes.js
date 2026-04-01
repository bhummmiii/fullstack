/**
 * adminRoutes.js – Admin-only routes
 *
 * Mounted at: /api/admin
 *
 * Routes:
 *   POST /api/admin/import-residents  – Upload an Excel file and import residents
 */

const express = require('express');
const router = express.Router();

const { importResidents } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// multer configured to save uploaded Excel files temporarily in server/uploads/
const path = require('path');
const multer = require('multer');

const excelStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    // Unique filename to avoid collisions: timestamp + original name
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage: excelStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are accepted'));
    }
  },
});

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

/**
 * @route   POST /api/admin/import-residents
 * @desc    Upload an Excel file and bulk-import resident users
 * @access  Admin only
 * @body    multipart/form-data  →  field name: "file"
 */
router.post('/import-residents', upload.single('file'), importResidents);

module.exports = router;
