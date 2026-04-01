const { validationResult } = require('express-validator');
const Notice = require('../models/Notice');

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

// ─── @desc    Create a notice
// ─── @route   POST /api/notices
// ─── @access  Admin only
const createNotice = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { title, description, type, priority, isPinned } = req.body;

    const noticeData = {
      title,
      description,
      type: type || 'general',
      priority: priority || 'normal',
      isPinned: isPinned === true || isPinned === 'true',
      postedBy: req.user._id,
    };

    // Optional file attachment
    if (req.file) {
      noticeData.attachment = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const notice = await Notice.create(noticeData);
    await notice.populate('postedBy', 'name flatNumber role');

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get all notices (newest / pinned first)
// ─── @route   GET /api/notices
// ─── @access  Private (all roles)
const getNotices = async (req, res, next) => {
  try {
    const { type, priority, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .populate('postedBy', 'name flatNumber role')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Notice.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update a notice
// ─── @route   PUT /api/notices/:id
// ─── @access  Admin only
const updateNotice = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const { title, description, type, priority, isPinned } = req.body;
    if (title !== undefined) notice.title = title;
    if (description !== undefined) notice.description = description;
    if (type !== undefined) notice.type = type;
    if (priority !== undefined) notice.priority = priority;
    if (isPinned !== undefined) notice.isPinned = isPinned === true || isPinned === 'true';

    if (req.file) {
      notice.attachment = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const updated = await notice.save();
    await updated.populate('postedBy', 'name flatNumber role');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete a notice
// ─── @route   DELETE /api/notices/:id
// ─── @access  Admin only
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    await notice.deleteOne();

    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNotice, getNotices, updateNotice, deleteNotice };
