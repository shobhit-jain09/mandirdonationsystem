require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const { scheduleReminderCheck } = require('./utils/cronJobs');
const { initializeTwilio } = require('./utils/smsService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize Twilio
    initializeTwilio();

    // Schedule cron jobs
    scheduleReminderCheck();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on port ${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();