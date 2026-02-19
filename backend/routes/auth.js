const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Login (Unchanged)
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

// Create User - Allows selecting Mandir
router.post('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, password, name, role, mandirId } = req.body; // Accept mandirId

    // Use provided mandirId OR fallback to logged-in admin's mandir
    const targetMandirId = mandirId || req.user.mandirId;

    if (!username || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username, mandir: targetMandirId });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists in this Mandir' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      role: role || 'staff',
      mandir: targetMandirId 
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Users - Populate Mandir Name
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Note: If you want to see ALL users across ALL mandirs, remove the filter. 
    // Currently, it shows users for the logged-in admin's Mandir.
    const users = await User.find({ mandir: req.user.mandirId })
      .select('-password')
      .populate('mandir', 'name'); // Add Mandir name
      
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Me (Unchanged)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('mandir');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;