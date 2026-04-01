const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
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
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['general', 'meeting', 'payment', 'alert', 'event'],
        message: 'Type must be general, meeting, payment, alert, or event',
      },
      default: 'general',
    },
    priority: {
      type: String,
      enum: {
        values: ['normal', 'important'],
        message: 'Priority must be normal or important',
      },
      default: 'normal',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posted by is required'],
    },
    attachment: {
      filename: { type: String },
      originalName: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      path: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Pinned notices first, then newest
noticeSchema.index({ isPinned: -1, createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
