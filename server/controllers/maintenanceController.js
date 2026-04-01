const { validationResult } = require('express-validator');
const dayjs = require('dayjs');
const Maintenance = require('../models/Maintenance');
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

// ─── @desc    Create a maintenance bill (admin generates for a resident)
// ─── @route   POST /api/maintenance
// ─── @access  Admin only
const createMaintenance = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { residentId, amount, month, dueDate } = req.body;

    // Verify the resident exists
    const resident = await User.findById(residentId);
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    // Prevent duplicate bill for same resident + month
    const existing = await Maintenance.findOne({ residentId, month });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Maintenance bill for ${month} already exists for this resident`,
      });
    }

    const record = await Maintenance.create({
      residentId,
      flatNumber: resident.flatNumber,
      amount,
      month,
      dueDate: dayjs(dueDate).toDate(),
      generatedBy: req.user._id,
    });

    await record.populate('residentId', 'name email flatNumber phone');

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get maintenance records
//             Admin → all records; Resident → own records
// ─── @route   GET /api/maintenance
// ─── @access  Private
const getMaintenanceRecords = async (req, res, next) => {
  try {
    const { status, month, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (req.user.role === 'resident') {
      filter.residentId = req.user._id;
    }

    if (status) filter.status = status;
    if (month) filter.month = { $regex: month, $options: 'i' };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [records, total] = await Promise.all([
      Maintenance.find(filter)
        .populate('residentId', 'name email flatNumber phone')
        .sort({ dueDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Maintenance.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: records,
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

// ─── @desc    Get maintenance records for a specific resident
// ─── @route   GET /api/maintenance/:residentId
// ─── @access  Private (admin or the resident themselves)
const getResidentMaintenance = async (req, res, next) => {
  try {
    const { residentId } = req.params;

    // Residents can only fetch their own bills
    if (req.user.role === 'resident' && req.user._id.toString() !== residentId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const records = await Maintenance.find({ residentId })
      .populate('residentId', 'name email flatNumber phone')
      .sort({ dueDate: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update maintenance record (mark as paid, change status, etc.)
// ─── @route   PUT /api/maintenance/:id
// ─── @access  Admin only
const updateMaintenance = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    const { status, paymentDate, paymentMethod, transactionId, amount } = req.body;

    if (status !== undefined) record.status = status;
    if (paymentDate !== undefined) record.paymentDate = dayjs(paymentDate).toDate();
    if (paymentMethod !== undefined) record.paymentMethod = paymentMethod;
    if (transactionId !== undefined) record.transactionId = transactionId;
    if (amount !== undefined) record.amount = amount;

    // Auto-set paymentDate when marking as Paid
    if (status === 'Paid' && !record.paymentDate) {
      record.paymentDate = new Date();
    }

    const updated = await record.save();
    await updated.populate('residentId', 'name email flatNumber phone');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete a maintenance record
// ─── @route   DELETE /api/maintenance/:id
// ─── @access  Admin only
const deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    await record.deleteOne();

    res.status(200).json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenance,
  getMaintenanceRecords,
  getResidentMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
