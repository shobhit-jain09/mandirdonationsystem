const mongoose = require('mongoose');

const mandirSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String, // NEW: Added email field
    trim: true,
    lowercase: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { 
  collection: 'mandirs'
});

module.exports = mongoose.model('Mandir', mandirSchema);