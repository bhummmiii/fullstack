const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
      minlength: [2, 'Visitor name must be at least 2 characters'],
      maxlength: [100, 'Visitor name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+\d\s\-()]{7,20}$/, 'Please enter a valid phone number'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
      maxlength: [500, 'Purpose cannot exceed 500 characters'],
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident ID is required'],
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat number is required'],
      trim: true,
    },
    expectedDate: {
      type: Date,
      required: [true, 'Expected date/time is required'],
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected', 'checked-in', 'checked-out'],
        message: 'Invalid status value',
      },
      default: 'Pending',
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: null,
    },
    guestCount: {
      type: Number,
      default: 1,
      min: [1, 'Guest count must be at least 1'],
      max: [20, 'Guest count cannot exceed 20'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.index({ residentId: 1, expectedDate: -1 });
visitorSchema.index({ status: 1, expectedDate: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;
