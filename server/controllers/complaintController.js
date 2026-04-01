const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

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

// ─── @desc    Create a new complaint
// ─── @route   POST /api/complaints
// ─── @access  Private (resident + admin)
const createComplaint = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { title, description, category, priority } = req.body;

    // Build attachments array from multer uploaded files
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
    }));

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      residentId: req.user._id,
      flatNumber: req.user.flatNumber,
      attachments,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get complaints
//             Admin  → all complaints (supports ?status, ?priority, ?search filters)
//             Resident → own complaints only
// ─── @route   GET /api/complaints
// ─── @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    // Residents see only their own complaints
    if (req.user.role === 'resident') {
      filter.residentId = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { flatNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('residentId', 'name email flatNumber phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Complaint.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: complaints,
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

// ─── @desc    Get single complaint by ID
// ─── @route   GET /api/complaints/:id
// ─── @access  Private (owner or admin)
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'residentId',
      'name email flatNumber phone'
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Residents can only view their own complaints
    if (
      req.user.role === 'resident' &&
      complaint.residentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update complaint
//             Resident → can update own Open complaint's title/description/category/priority
//             Admin → can update status, assignedTo, any field
// ─── @route   PUT /api/complaints/:id
// ─── @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role === 'resident') {
      // Residents can only edit their own complaints
      if (complaint.residentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      // Residents cannot change status directly
      const { title, description, category, priority } = req.body;
      if (title !== undefined) complaint.title = title;
      if (description !== undefined) complaint.description = description;
      if (category !== undefined) complaint.category = category;
      if (priority !== undefined) complaint.priority = priority;
    } else {
      // Admin can update everything
      const { title, description, category, priority, status, assignedTo } = req.body;
      if (title !== undefined) complaint.title = title;
      if (description !== undefined) complaint.description = description;
      if (category !== undefined) complaint.category = category;
      if (priority !== undefined) complaint.priority = priority;
      if (status !== undefined) {
        complaint.status = status;
        if (status === 'Resolved' && !complaint.resolvedDate) {
          complaint.resolvedDate = new Date();
        }
      }
      if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    }

    const updated = await complaint.save();
    await updated.populate('residentId', 'name email flatNumber phone');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete complaint
//             Resident → can delete own unresolved complaints
//             Admin → can delete any
// ─── @route   DELETE /api/complaints/:id
// ─── @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role === 'resident') {
      if (complaint.residentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (complaint.status === 'Resolved') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete a resolved complaint',
        });
      }
    }

    await complaint.deleteOne();

    res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
