# 🚀 Deployment Guide - Mandir Donation Management System

## 📋 Table of Contents
1. [Local Deployment](#local-deployment)
2. [MongoDB Setup](#mongodb-setup)
3. [Twilio SMS Setup](#twilio-sms-setup)
4. [Running the Application](#running-the-application)
5. [Production Deployment](#production-deployment)

---

## 🏠 Local Deployment

### Step 1: Clone the Repository

```bash
git clone https://github.com/shobhit-jain09/mandirdonationsystem.git
cd mandirdonationsystem
```

### Step 2: Install MongoDB

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Step 3: Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/mandir-donation
JWT_SECRET=mandir_donation_secret_key_2024
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
NODE_ENV=development
EOF
```

### Step 4: Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
```

---

## 📊 MongoDB Setup

### Option 1: Local MongoDB (Recommended for Development)

```bash
# Start MongoDB
sudo systemctl start mongodb

# Check status
sudo systemctl status mongodb

# Access MongoDB shell
mongo
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Sign up**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Follow the free tier setup
3. **Get Connection String**: 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update backend/.env**:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mandir-donation?retryWrites=true&w=majority
```

---

## 📱 Twilio SMS Setup

### Step 1: Create Twilio Account

1. Visit [Twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your phone number

### Step 2: Get Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token**
3. Go to "Phone Numbers" → "Buy a Number"
4. Select a number with SMS capability

### Step 3: Update Backend Configuration

Update `backend/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Test SMS (Optional)

```bash
cd backend
node -e "
const twilio = require('twilio');
const client = twilio('YOUR_SID', 'YOUR_TOKEN');
client.messages.create({
  body: 'Test from Mandir Donation System',
  from: '+1234567890',
  to: '+your_phone_number'
}).then(msg => console.log('SMS sent:', msg.sid));
"
```

### Important Notes:
- **Free Tier**: Twilio gives you $15 credit (send ~1000 SMS)
- **Verification**: You must verify recipient numbers on free tier
- **Indian Numbers**: Format as `+91xxxxxxxxxx`
- **Mock Mode**: App works without Twilio, logs to console

---

## 🏃 Running the Application

### Option 1: Two Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

### Option 2: Using PM2 (Production-like)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "mandir-backend"

# Start frontend
cd ../frontend
pm2 start npm --name "mandir-frontend" -- start

# View logs
pm2 logs

# Stop all
pm2 stop all
```

### Default Login Credentials

```
Username: shobhit
Password: W0rk@0990
```

⚠️ **Change password after first login!**

---

## 🌐 Production Deployment

### Backend Deployment (Railway/Render)

#### Using Railway:

1. **Sign up**: [Railway](https://railway.app/)
2. **New Project** → **Deploy from GitHub**
3. **Select Repository**: mandirdonationsystem
4. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secure_secret_here
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   NODE_ENV=production
   ```
5. **Set Start Command**: `cd backend && npm start`
6. **Note the deployed URL**: `https://your-app.railway.app`

#### Using Render:

1. **Sign up**: [Render](https://render.com/)
2. **New** → **Web Service**
3. **Connect Repository**
4. **Settings**:
   - Name: mandir-donation-backend
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. **Add Environment Variables** (same as above)

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`

4. **Redeploy**: `vercel --prod`

#### Using Netlify:

1. **Sign up**: [Netlify](https://www.netlify.com/)
2. **New site from Git** → Select repository
3. **Build settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. **Environment Variables**:
   - `REACT_APP_API_URL=https://your-backend-url.railway.app/api`

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (generate: `openssl rand -base64 32`)
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable MongoDB backup
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Enable environment-specific logging
- [ ] Set up monitoring (e.g., Sentry)

---

## 📊 Monitoring & Maintenance

### Check Backend Logs

```bash
# Local
cd backend
npm start

# PM2
pm2 logs mandir-backend

# Railway
View on Railway dashboard

# Render
View on Render dashboard
```

### Check Cron Job Status

Cron job runs daily at 9 AM. Check logs for:
```
Running daily donation reminder check...
Found X pending donations to remind
Reminder sent to [Name] ([Phone])
```

### Database Backup

```bash
# Local MongoDB backup
mongodump --db mandir-donation --out /path/to/backup

# Restore
mongorestore --db mandir-donation /path/to/backup/mandir-donation
```

### MongoDB Atlas Backup
- Automatic backups enabled by default
- Go to cluster → Backup → Configure

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>

# Check MongoDB
sudo systemctl status mongodb

# Check logs
cd backend
npm start
```

### Frontend can't connect to backend

1. Check `frontend/.env` has correct `REACT_APP_API_URL`
2. Check backend is running
3. Check CORS settings in `backend/server.js`
4. Open browser console for errors

### SMS not sending

1. Verify Twilio credentials
2. Check phone number format (+country code)
3. Verify Twilio account balance
4. Check recipient is verified (free tier)
5. Review backend logs

### MongoDB connection failed

1. Check MongoDB is running: `sudo systemctl status mongodb`
2. Verify connection string in `.env`
3. Check network access (Atlas whitelist)
4. Test connection: `mongo` or `mongosh`

---

## 📞 Support

For issues:
1. Check logs first
2. Review this guide
3. Check GitHub Issues
4. Contact administrator

---

## 🎉 Success!

Once deployed, you should be able to:
- ✅ Login with admin credentials
- ✅ Create donations
- ✅ Generate receipts
- ✅ View statistics
- ✅ Manage users (admin)
- ✅ Receive automated reminders (after 15 days)

**Repository**: https://github.com/shobhit-jain09/mandirdonationsystem.git
