const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'water',
          'electricity',
          'cleanliness',
          'parking',
          'security',
          'maintenance',
          'noise',
          'other',
        ],
        message: 'Invalid category',
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be low, medium, high, or urgent',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Resolved'],
        message: 'Status must be Open, In Progress, or Resolved',
      },
      default: 'Open',
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident ID is required'],
    },
    flatNumber: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: null,
    },
    attachments: [
      {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        path: { type: String },
      },
    ],
    resolvedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster resident-specific queries
complaintSchema.index({ residentId: 1, status: 1 });
complaintSchema.index({ status: 1, createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
