# 🚀 Quick Start Guide - Mandir Donation System

## ✅ All Code is in GitHub!
**Repository**: https://github.com/shobhit-jain09/mandirdonationsystem.git

---

## 📦 What's Included

✅ Complete Backend (Node.js/Express)
✅ Complete Frontend (React.js)
✅ MongoDB Integration (Cloud Ready)
✅ Twilio SMS Integration (Placeholder Ready)
✅ Automated 15-day Reminder System
✅ Receipt Generation
✅ User Management
✅ Authentication & Authorization

---

## 🎯 Option 1: Quick Deploy to Production (Recommended)

### Step 1: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `shobhit-jain09/mandirdonationsystem`
5. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://mandiruser:Mandir2024Donation@cluster0.mongodb.net/mandir-donation?retryWrites=true&w=majority
   JWT_SECRET=mandir_donation_secret_key_2024_secure_production
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   NODE_ENV=production
   ```
6. **Root Directory**: Set to `backend`
7. **Start Command**: `npm start`
8. **Deploy** and copy the URL (e.g., `https://mandirdonation-production.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Import Project** from GitHub
3. **Select**: `shobhit-jain09/mandirdonationsystem`
4. **Framework Preset**: Create React App
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `build`
8. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   ```
9. **Deploy**

### Step 3: Login & Test

1. Open your Vercel URL
2. Login with:
   - Username: `shobhit`
   - Password: `W0rk@0990`
3. ⚠️ **IMPORTANT**: Change password immediately!

---

## 🏠 Option 2: Run Locally

### Prerequisites
- Node.js (v14+)
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/shobhit-jain09/mandirdonationsystem.git
cd mandirdonationsystem/backend

# Install dependencies
npm install

# The .env file is already configured with MongoDB Atlas
# Just start the server
npm start
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
# In a new terminal
cd mandirdonationsystem/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend opens at: http://localhost:3000

---

## 🔑 Default Login

```
Username: shobhit
Password: W0rk@0990
```

**⚠️ Change this password after first login!**

---

## 📱 Twilio SMS Setup (Optional)

### Without Twilio (Mock Mode)
- App works perfectly without Twilio
- SMS messages are logged to console
- All other features work normally

### With Twilio (Real SMS)

1. **Sign up**: https://www.twilio.com/try-twilio
2. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone Number
3. **Update backend .env**:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```
4. **Restart backend**
5. SMS reminders will automatically start working!

---

## 🎨 Features You Can Use Right Away

### Admin Features (username: shobhit)
- ✅ Create new donations
- ✅ Generate receipts
- ✅ View all donations
- ✅ Update payment status
- ✅ Create new users (staff/admin)
- ✅ View statistics dashboard
- ✅ Filter donations

### Staff Features
- ✅ Create donations
- ✅ Generate receipts
- ✅ View donations
- ✅ Update payment status

### Automated Features
- ✅ Receipt number auto-generation
- ✅ Daily cron job (9 AM)
- ✅ 15-day reminder checks
- ✅ SMS reminders (when Twilio configured)

---

## 📊 Database

**MongoDB Atlas** is pre-configured in the code:
- No local MongoDB installation needed
- Cloud-hosted database
- Automatic backups
- Free tier available

The connection string is already in the `.env` file!

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm start
```

### Frontend won't start
```bash
cd frontend
npm install
npm start
```

### "Cannot connect to backend"
1. Make sure backend is running on port 5000
2. Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:5000/api`

### "MongoDB connection failed"
- The pre-configured MongoDB Atlas should work
- If issues, create your own MongoDB Atlas account and update the connection string

---

## 📖 Full Documentation

For detailed documentation, see:
- **README.md** - Complete project documentation
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions

---

## 🎉 You're All Set!

Your temple donation management system is ready to use. The code is in GitHub, MongoDB is configured, and you can deploy or run locally anytime!

**Need Help?**
- Check DEPLOYMENT_GUIDE.md for detailed instructions
- Review README.md for full documentation
- All code is in: https://github.com/shobhit-jain09/mandirdonationsystem.git

---

**Built with ❤️ for Temple Management**