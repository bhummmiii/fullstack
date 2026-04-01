const { validationResult } = require('express-validator');
const User = require('../models/User');

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

// ─── @desc    Get all residents (admin only)
// ─── @route   GET /api/residents
// ─── @access  Admin
const getResidents = async (req, res, next) => {
  try {
    const { search, block, role: residentRole, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { flatNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Block filter: flatNumber starts with block letter, e.g. "A-"
    if (block && block !== 'all') {
      filter.flatNumber = { $regex: `^${block}-`, $options: 'i' };
    }

    if (residentRole) filter.role = residentRole;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [residents, total] = await Promise.all([
      User.find(filter)
        .select('-__v')
        .sort({ flatNumber: 1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: residents,
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

// ─── @desc    Get a single resident by ID
// ─── @route   GET /api/residents/:id
// ─── @access  Admin or the resident themselves
const getResidentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'resident' && req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const resident = await User.findById(id).select('-__v');
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.status(200).json({ success: true, data: resident });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update a resident profile (admin can update any; resident → own only)
// ─── @route   PUT /api/residents/:id
// ─── @access  Private
const updateResident = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { id } = req.params;

    if (req.user.role === 'resident' && req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Fields a resident can update
    const residentAllowed = ['name', 'phone'];
    // Extra fields only admins can update
    const adminAllowed = ['flatNumber', 'role', 'isActive'];

    const updates = {};
    residentAllowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (req.user.role === 'admin') {
      adminAllowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    }

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const resident = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v');

    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.status(200).json({ success: true, data: resident });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Deactivate / delete a resident (admin only)
// ─── @route   DELETE /api/residents/:id
// ─── @access  Admin
const deleteResident = async (req, res, next) => {
  try {
    const resident = await User.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    // Soft-delete: deactivate the account rather than removing the document
    if (resident.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be deleted through this endpoint',
      });
    }

    resident.isActive = false;
    await resident.save();

    res.status(200).json({ success: true, message: 'Resident deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResidents, getResidentById, updateResident, deleteResident };
