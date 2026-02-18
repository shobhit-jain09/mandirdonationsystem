const cron = require('node-cron');
const Donation = require('../models/Donation');
const { sendSMS } = require('./smsService');

// Run daily at 9 AM
const scheduleReminderCheck = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily donation reminder check...');

    try {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      // Find pledged donations older than 15 days
      const pendingDonations = await Donation.find({
        paymentStatus: 'Pledged',
        donationDate: { $lte: fifteenDaysAgo },
      });

      console.log(`Found ${pendingDonations.length} pending donations to remind`);

      for (const donation of pendingDonations) {
        const daysPending = Math.floor(
          (new Date() - new Date(donation.donationDate)) / (1000 * 60 * 60 * 24)
        );

        const message = `Namaste ${donation.donorName},\n\nThis is a gentle reminder about your pledged donation of ₹${donation.amount} for ${donation.donationType}.\n\nIt has been ${daysPending} days since your pledge. We kindly request you to complete the donation.\n\nReceipt No: ${donation.receiptNumber}\n\nThank you for your support!\n\nMandir Administration`;

        // Send SMS
        const smsSent = await sendSMS(donation.phoneNumber, message);

        if (smsSent) {
          // Update reminder count
          donation.remindersSent += 1;
          donation.lastReminderDate = new Date();
          await donation.save();
          console.log(`Reminder sent to ${donation.donorName} (${donation.phoneNumber})`);
        }
      }

      console.log('Reminder check completed');
    } catch (error) {
      console.error('Error in reminder check:', error);
    }
  });

  console.log('Donation reminder cron job scheduled (daily at 9 AM)');
};

module.exports = { scheduleReminderCheck };