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

    if (!username || !password || !mandirId) {
      return res.status(400).json({ message: 'Mandir, Username and password are required' });
    }

    // Find user specifically in the selected Mandir
    const user = await User.findOne({ username, mandir: mandirId }).populate('mandir');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role, 
        mandirId: user.mandir._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        mandirName: user.mandir.name
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (admin only)
router.post('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    // Get the Mandir ID from the logged-in admin's user record
    const loggedInAdmin = await User.findById(req.user.id);
    const mandirId = loggedInAdmin.mandir; 

    // Validate input
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists in THIS Mandir
    const existingUser = await User.findOne({ username, mandir: mandirId });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists in this Mandir' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user linked to same Mandir
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      role: role || 'staff',
      mandir: mandirId
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const loggedInAdmin = await User.findById(req.user.id);
    // Only fetch users from the same Mandir
    const users = await User.find({ mandir: loggedInAdmin.mandir }).select('-password');
    res.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('mandir');
    res.json({ user });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
