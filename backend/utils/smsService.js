const twilio = require('twilio');

let twilioClient = null;

// Initialize Twilio client if credentials are provided
const initializeTwilio = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken && accountSid !== 'your_twilio_account_sid') {
    try {
      twilioClient = twilio(accountSid, authToken);
      console.log('Twilio SMS service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Twilio:', error.message);
      return false;
    }
  } else {
    console.log('Twilio credentials not configured. SMS service will be in mock mode.');
    return false;
  }
};

// Send SMS using Twilio
const sendSMS = async (phoneNumber, message) => {
  try {
    // If Twilio is not initialized, log the message instead
    if (!twilioClient) {
      console.log('\n--- SMS MOCK MODE ---');
      console.log(`To: ${phoneNumber}`);
      console.log(`Message: ${message}`);
      console.log('--- END SMS ---\n');
      console.log('Note: Configure Twilio credentials in .env to enable actual SMS sending');
      return true; // Return true to mark as "sent" in mock mode
    }

    // Send actual SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS sent successfully. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error.message);
    return false;
  }
};

module.exports = { initializeTwilio, sendSMS };