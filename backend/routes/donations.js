const express = require('express');
const Donation = require('../models/Donation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create new donation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { donorName, address, phoneNumber, amount, donationDate, donationType, paymentStatus } = req.body;

    // Validate input
    if (!donorName || !address || !phoneNumber || !amount || !donationType || !paymentStatus) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create donation
    const donation = new Donation({
      donorName,
      address,
      phoneNumber,
      amount,
      donationDate: donationDate || Date.now(),
      donationType,
      paymentStatus,
      createdBy: req.user.id,
    });

    await donation.save();

    res.status(201).json({
      message: 'Donation recorded successfully',
      donation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all donations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, type, startDate, endDate } = req.query;
    const filter = {};

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

// Get single donation
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('createdBy', 'name username');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ donation });
  } catch (error) {
    console.error('Fetch donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation payment status
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Received', 'Pledged'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Valid payment status is required' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({
      message: 'Payment status updated successfully',
      donation,
    });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donation statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const receivedDonations = await Donation.countDocuments({ paymentStatus: 'Received' });
    const pledgedDonations = await Donation.countDocuments({ paymentStatus: 'Pledged' });

    const totalAmount = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const receivedAmount = await Donation.aggregate([
      { $match: { paymentStatus: 'Received' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pledgedAmount = await Donation.aggregate([
      { $match: { paymentStatus: 'Pledged' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      stats: {
        totalDonations,
        receivedDonations,
        pledgedDonations,
        totalAmount: totalAmount[0]?.total || 0,
        receivedAmount: receivedAmount[0]?.total || 0,
        pledgedAmount: pledgedAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;