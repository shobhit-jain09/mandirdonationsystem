# 🕉️ Mandir Donation Management System

A comprehensive web application for managing temple donations with automated SMS reminders for pledged donations.

## 📋 Features

### ✨ Core Functionality
- **User Authentication**: Secure JWT-based login system
- **Role-Based Access**: Admin and Staff roles with different permissions
- **Donation Management**: 
  - Record new donations with donor details
  - Track payment status (Received/Pledged)
  - Generate professional receipts
  - Filter and search donations
  - Real-time statistics dashboard

### 🔔 Automated Reminders
- Daily cron job checks for pledged donations older than 15 days
- Automated SMS reminders via Twilio integration
- Stops reminders once payment status is updated to "Received"

### 👥 User Management (Admin Only)
- Create new staff/admin users
- View all system users
- Secure password hashing with bcrypt

### 🧾 Receipt Generation
- Professional, printable HTML receipts
- Automatic receipt number generation
- Status watermarks (PAID/PENDING)
- All donation details included

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **node-cron** for scheduled tasks
- **Twilio** for SMS integration

### Frontend
- **React.js** (v18)
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure

```
mandir-donation-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection & admin setup
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Donation.js          # Donation schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── donations.js         # Donation CRUD routes
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── utils/
│   │   ├── cronJobs.js          # 15-day reminder scheduler
│   │   └── smsService.js        # Twilio SMS integration
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── DonationForm.js  # New donation form
│   │   │   ├── DonationList.js  # List all donations
│   │   │   ├── Receipt.js       # Receipt component
│   │   │   └── UserManagement.js# User management (admin)
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth state management
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Twilio account (for SMS functionality)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mandir-donation
   JWT_SECRET=your_jwt_secret_key_here
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   NODE_ENV=development
   ```

4. **Start the server**:
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🔑 Default Admin Credentials

```
Username: shobhit
Password: W0rk@0990
```

**⚠️ Important**: Change these credentials after first login!

## 📱 Twilio SMS Setup

### Getting Twilio Credentials

1. **Sign up for Twilio**: Visit [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)

2. **Get your credentials**:
   - Go to Twilio Console Dashboard
   - Find your **Account SID** and **Auth Token**
   - Get a Twilio phone number

3. **Update backend `.env`**:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Restart the backend server**

### Mock Mode
If Twilio credentials are not configured, the system runs in **mock mode**:
- SMS content is logged to console
- No actual SMS is sent
- All other functionality works normally

## 🔄 Automated Reminder System

### How It Works

1. **Daily Check**: Cron job runs every day at 9 AM
2. **Criteria**: Finds donations where:
   - Payment status = "Pledged"
   - Donation date is more than 15 days old
3. **Action**: Sends automated SMS reminder
4. **Tracking**: Updates `remindersSent` count and `lastReminderDate`
5. **Stop**: Reminders stop when status changes to "Received"

### SMS Message Template
```
Namaste [Donor Name],

This is a gentle reminder about your pledged donation of ₹[Amount] for [Donation Type].

It has been [Days] days since your pledge. We kindly request you to complete the donation.

Receipt No: [Receipt Number]

Thank you for your support!

Mandir Administration
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/users` - Create new user (admin only)
- `GET /api/auth/users` - Get all users (admin only)

### Donations
- `POST /api/donations` - Create new donation
- `GET /api/donations` - Get all donations (with filters)
- `GET /api/donations/:id` - Get single donation
- `PATCH /api/donations/:id` - Update payment status
- `GET /api/donations/stats/summary` - Get donation statistics

## 🎨 Features Breakdown

### Dashboard
- Real-time statistics cards
- Total donations count
- Total amount collected
- Received vs Pledged breakdown

### Donation Form
- Donor details (name, address, phone)
- Donation amount and date
- Donation type dropdown:
  - Go Sanrakshan Daan
  - Mandir Nirman
  - Mandir Sanrakshan
- Payment status toggle

### Receipt
- Professional design with watermark
- Auto-generated receipt number
- Complete donor and donation details
- Printable format
- Status indication (Paid/Pending)

### Filters
- Filter by payment status
- Filter by donation type
- Date range filtering
- Real-time search

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Role-based access control
- Secure token storage

## 🎯 User Roles

### Admin
- All staff permissions
- Create new users
- View all users
- Full system access

### Staff
- Create donations
- View all donations
- Update payment status
- Generate receipts

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mandir-donation
```

### SMS Not Sending
1. Check Twilio credentials in `.env`
2. Verify phone number format (E.164: +1234567890)
3. Check Twilio account balance
4. Review console logs for errors

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001

# Or kill the process
lsof -ti:5000 | xargs kill -9
```

## 📝 Development Notes

### Adding New Donation Types
1. Update `Donation.js` model enum
2. Update dropdown in `DonationForm.js`
3. Update filter in `DonationList.js`

### Customizing Cron Schedule
Edit `backend/utils/cronJobs.js`:
```javascript
// Format: minute hour day month weekday
cron.schedule('0 9 * * *', ...) // 9 AM daily
cron.schedule('0 18 * * *', ...) // 6 PM daily
cron.schedule('0 9 * * 1', ...) // 9 AM every Monday
```

### Changing Reminder Threshold
Edit `backend/utils/cronJobs.js`:
```javascript
const fifteenDaysAgo = new Date();
fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15); // Change 15 to desired days
```

## 🚢 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables in platform dashboard
2. Deploy backend code
3. Note the deployed URL

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update `REACT_APP_API_URL` to backend URL
2. Build: `npm run build`
3. Deploy build folder

## 📄 License

This project is created for temple management purposes.

## 👨‍💻 Developer

Developed by Shobhit

## 🙏 Acknowledgments

- Temple administration for requirements
- Open source community for amazing tools

---

**Note**: This system is designed for temple donation management. Customize as per your specific requirements.

For any issues or feature requests, please contact the administrator.