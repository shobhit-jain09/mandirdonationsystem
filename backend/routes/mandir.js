const express = require('express');
const Mandir = require('../models/Mandir');
const router = express.Router();

// Get list of all Mandirs
router.get('/list', async (req, res) => {
  try {
    const mandirs = await Mandir.find().select('name _id');
    res.json(mandirs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new Mandir ONLY (No User Creation)
router.post('/register', async (req, res) => {
  try {
    const { mandirName, phoneNumber, contactPerson } = req.body;

    if (!mandirName || !phoneNumber) {
      return res.status(400).json({ message: 'Mandir Name and Phone are required' });
    }

    const newMandir = new Mandir({
      name: mandirName,
      phoneNumber,
      contactPerson
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