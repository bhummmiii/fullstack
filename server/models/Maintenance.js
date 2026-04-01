const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true,
      // e.g. "January 2024"
    },
    status: {
      type: String,
      enum: {
        values: ['Paid', 'Unpaid', 'Overdue'],
        message: 'Status must be Paid, Unpaid, or Overdue',
      },
      default: 'Unpaid',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['UPI', 'Bank Transfer', 'Cash', 'Cheque', null],
        message: 'Invalid payment method',
      },
      default: null,
    },
    transactionId: {
      type: String,
      trim: true,
      default: null,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

maintenanceSchema.index({ residentId: 1, month: 1 });
maintenanceSchema.index({ status: 1, dueDate: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;
