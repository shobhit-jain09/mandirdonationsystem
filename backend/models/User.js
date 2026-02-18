const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    // unique: true is removed from here to allow same username in different mandirs
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
  },
  mandir: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandir',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index: Username must be unique ONLY within a specific Mandir
userSchema.index({ username: 1, mandir: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
