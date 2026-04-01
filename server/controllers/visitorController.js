const { validationResult } = require('express-validator');
const dayjs = require('dayjs');
const Visitor = require('../models/Visitor');

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

// ─── @desc    Add a visitor entry (pre-approval or walk-in log)
// ─── @route   POST /api/visitors
// ─── @access  Private (resident + admin)
const createVisitor = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { visitorName, phone, purpose, expectedDate, vehicleNumber, guestCount } = req.body;

    const visitor = await Visitor.create({
      visitorName,
      phone,
      purpose,
      residentId: req.user._id,
      flatNumber: req.user.flatNumber,
      expectedDate: dayjs(expectedDate).toDate(),
      vehicleNumber: vehicleNumber || null,
      guestCount: guestCount || 1,
    });

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get visitor logs
//             Admin → all; Resident → own flat's visitors
// ─── @route   GET /api/visitors
// ─── @access  Private
const getVisitors = async (req, res, next) => {
  try {
    const { status, search, date, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (req.user.role === 'resident') {
      filter.residentId = req.user._id;
    }

    if (status) filter.status = status;

    if (date) {
      // Filter by specific date (entire day range)
      const start = dayjs(date).startOf('day').toDate();
      const end = dayjs(date).endOf('day').toDate();
      filter.expectedDate = { $gte: start, $lte: end };
    }

    if (search) {
      filter.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { flatNumber: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [visitors, total] = await Promise.all([
      Visitor.find(filter)
        .populate('residentId', 'name email flatNumber phone')
        .sort({ expectedDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Visitor.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: visitors,
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

// ─── @desc    Update visitor entry (approve/reject, check-in/out)
// ─── @route   PUT /api/visitors/:id
// ─── @access  Private
//             Admin → approve/reject, check-in/out
//             Resident → update own pending entries (name, phone, purpose, expectedDate)
const updateVisitor = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor entry not found' });
    }

    if (req.user.role === 'resident') {
      // Residents can only update their own entries and only while Pending
      if (visitor.residentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (visitor.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify an entry that has already been processed',
        });
      }
      const { visitorName, phone, purpose, expectedDate, vehicleNumber, guestCount } = req.body;
      if (visitorName !== undefined) visitor.visitorName = visitorName;
      if (phone !== undefined) visitor.phone = phone;
      if (purpose !== undefined) visitor.purpose = purpose;
      if (expectedDate !== undefined) visitor.expectedDate = dayjs(expectedDate).toDate();
      if (vehicleNumber !== undefined) visitor.vehicleNumber = vehicleNumber;
      if (guestCount !== undefined) visitor.guestCount = guestCount;
    } else {
      // Admin can change status and check-in/out times
      const { status, checkInTime, checkOutTime } = req.body;
      if (status !== undefined) {
        visitor.status = status;
        if (status === 'Approved') visitor.approvedBy = req.user._id;
        if (status === 'checked-in') visitor.checkInTime = checkInTime ? dayjs(checkInTime).toDate() : new Date();
        if (status === 'checked-out') visitor.checkOutTime = checkOutTime ? dayjs(checkOutTime).toDate() : new Date();
      }
    }

    const updated = await visitor.save();
    await updated.populate('residentId', 'name email flatNumber phone');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete a visitor entry
// ─── @route   DELETE /api/visitors/:id
// ─── @access  Admin or the resident who created it (while Pending)
const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor entry not found' });
    }

    if (req.user.role === 'resident') {
      if (visitor.residentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (visitor.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete a visitor entry that has already been processed',
        });
      }
    }

    await visitor.deleteOne();

    res.status(200).json({ success: true, message: 'Visitor entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createVisitor, getVisitors, updateVisitor, deleteVisitor };
