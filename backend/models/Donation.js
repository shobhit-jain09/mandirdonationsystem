const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  donationType: {
    type: String,
    required: true,
    enum: ['Go Sanrakshan Daan', 'Mandir Nirman', 'Mandir Sanrakshan'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Received', 'Pledged'],
    default: 'Pledged',
  },
  receiptNumber: {
    type: String,
    unique: true,
  },
  remindersSent: {
    type: Number,
    default: 0,
  },
  lastReminderDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate receipt number before saving
donationSchema.pre('save', async function (next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model('Donation').countDocuments();
    const year = new Date().getFullYear();
    this.receiptNumber = `RCP${year}${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema);