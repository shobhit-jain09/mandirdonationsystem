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
    enum: ['Go Sanrakshan Daan', 'Mandir Nirman', 'Mandir Sanrakshan', 'General'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Received', 'Pledged'],
    default: 'Pledged',
  },
  receiptNumber: {
    type: String,
  },
  // ADDED: Link donation to a specific Mandir
  mandir: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandir',
    required: true,
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

// Compound index: Receipt numbers should be unique PER MANDIR
donationSchema.index({ receiptNumber: 1, mandir: 1 }, { unique: true });

// Generate receipt number before saving
donationSchema.pre('save', async function (next) {
  if (!this.receiptNumber) {
    // Count donations ONLY for this specific Mandir
    const count = await mongoose.model('Donation').countDocuments({ mandir: this.mandir });
    const year = new Date().getFullYear();
    // Format: RCP-2024-000001
    this.receiptNumber = `RCP${year}${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema);