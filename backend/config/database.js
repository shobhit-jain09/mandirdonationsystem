const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');

    // Create default admin user if not exists
    const adminExists = await User.findOne({ username: 'shobhit' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('W0rk@0990', 10);
      const admin = new User({
        username: 'shobhit',
        password: hashedPassword,
        role: 'admin',
        name: 'Shobhit Admin',
      });
      await admin.save();
      console.log('Default admin user created: shobhit');
    }
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;