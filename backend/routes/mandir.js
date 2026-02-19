const express = require('express');
const Mandir = require('../models/Mandir');
const router = express.Router();

// Get list of all Mandirs (for Login Dropdown)
router.get('/list', async (req, res) => {
  try {
    const mandirs = await Mandir.find().select('name _id');
    res.json(mandirs);
  } catch (error) {
    console.error('Fetch mandirs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new Mandir
router.post('/register', async (req, res) => {
  try {
    // NEW: Destructure email from req.body
    const { mandirName, phoneNumber, email, contactPerson, address } = req.body;

    if (!mandirName || !phoneNumber || !address) {
      return res.status(400).json({ message: 'Mandir Name, Phone, and Address are required' });
    }

    // Create Mandir
    const newMandir = new Mandir({
      name: mandirName,
      phoneNumber,
      email, // NEW: Save email to database
      contactPerson,
      address 
    });
    
    const savedMandir = await newMandir.save();

    res.status(201).json({ 
      message: 'Mandir registered successfully', 
      mandirId: savedMandir._id 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;