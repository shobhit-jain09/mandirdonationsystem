const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, mandirId } = req.body;
    if (!username || !password || !mandirId) return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ username, mandir: mandirId }).populate('mandir');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, mandirId: user.mandir._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role, mandirName: user.mandir.name },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create User - Strictly restricted to logged-in Admin's Mandir
router.post('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, password, name, role } = req.body; 

    // FORCE security: The new user is strictly locked to the admin's Mandir
    const targetMandirId = req.user.mandirId;

    if (!username || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username, mandir: targetMandirId });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists in your Mandir' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      role: role || 'staff',
      mandir: targetMandirId // Saved securely
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Users - Strictly restricted to logged-in Admin's Mandir
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    // SECURITY: Only find users belonging to the admin's Mandir
    const users = await User.find({ mandir: req.user.mandirId })
      .select('-password'); 
      
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('mandir');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;