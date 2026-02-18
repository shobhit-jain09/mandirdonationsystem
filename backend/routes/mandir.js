const express = require('express');
const bcrypt = require('bcryptjs');
const Mandir = require('../models/Mandir');
const User = require('../models/User');
const router = express.Router();

// Get list of all Mandirs (for Login Dropdown)
router.get('/list', async (req, res) => {
  try {
    const mandirs = await Mandir.find().select('name _id');
    res.json(mandirs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new Mandir + First Admin User
router.post('/register', async (req, res) => {
  try {
    const { 
      mandirName, 
      phoneNumber, 
      contactPerson, 
      username, 
      password 
    } = req.body;

    if (!mandirName || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Create Mandir
    const newMandir = new Mandir({
      name: mandirName,
      phoneNumber,
      contactPerson
    });
    const savedMandir = await newMandir.save();

    // 2. Create Admin User for this Mandir
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      name: contactPerson,
      role: 'admin',
      mandir: savedMandir._id
    });
    
    await newUser.save();

    res.status(201).json({ 
      message: 'Mandir registered successfully', 
      mandirId: savedMandir._id 
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Username already exists for this Mandir' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
