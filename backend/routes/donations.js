const express = require('express');
const Donation = require('../models/Donation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create new donation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { donorName, address, phoneNumber, amount, donationDate, donationType, paymentStatus } = req.body;

    if (!donorName || !address || !phoneNumber || !amount || !donationType || !paymentStatus) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Fix: Get mandirId from the logged-in user
    const mandirId = req.user.mandirId || req.user.mandir;

    if (!mandirId) {
       return res.status(400).json({ message: 'User is not associated with a Mandir' });
    }

    const donation = new Donation({
      donorName,
      address,
      phoneNumber,
      amount,
      donationDate: donationDate || Date.now(),
      donationType,
      paymentStatus,
      createdBy: req.user.id,
      mandir: mandirId // ADDED: Save the Mandir ID
    });

    await donation.save();

    res.status(201).json({
      message: 'Donation recorded successfully',
      donation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all donations (Filtered by Mandir)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, type, startDate, endDate } = req.query;
    
    // ADDED: Filter by Mandir
    const filter = { mandir: req.user.mandirId };

    if (status) filter.paymentStatus = status;
    if (type) filter.donationType = type;
    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    const donations = await Donation.find(filter)
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });

    res.json({ donations });
  } catch (error) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... Keep other routes (get/:id, update, stats) similar to previous versions ...
// Make sure to add { mandir: req.user.mandirId } to all .find() or .aggregate() calls

module.exports = router;