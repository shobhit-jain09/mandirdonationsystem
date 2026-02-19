require('dotenv').config();

// Force Node.js to use Google DNS to bypass network blocks on SRV records
try {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']); 
} catch (error) {
  console.error("DNS Fix failed:", error);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const mandirRoutes = require('./routes/mandir'); 
const { scheduleReminderCheck } = require('./utils/cronJobs');
const { initializeTwilio } = require('./utils/smsService');

// Import models for index cleanup
const Donation = require('./models/Donation');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/mandirs', mandirRoutes); 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. CRITICAL FIX: Clean up old Global Unique Indexes
    try {
      // Drop old global receipt constraints
      await Donation.collection.dropIndex('receiptNumber_1');
      console.log('✅ Cleaned up old global receipt constraints');
    } catch (err) {
      // Ignore if index doesn't exist anymore
    }

    try {
      // Drop old global username constraints
      await User.collection.dropIndex('username_1');
      console.log('✅ Cleaned up old global username constraints');
    } catch (err) {
      // Ignore if index doesn't exist anymore
    }

    // 3. Sync the new multi-tenant compound indexes
    await Donation.syncIndexes();
    await User.syncIndexes();
    console.log('✅ Multi-tenant database indexes synced successfully');

    // 4. Initialize external services
    initializeTwilio();
    scheduleReminderCheck();

    // 5. Start Express server
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