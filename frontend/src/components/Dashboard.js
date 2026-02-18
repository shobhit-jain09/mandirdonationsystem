import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DonationForm from './DonationForm';
import DonationList from './DonationList';
import UserManagement from './UserManagement';
import { LogOut, PlusCircle, List, Users, Home } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDonationSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="brand-icon">🕉️</div>
          <div>
            <h1>Mandir Donation</h1>
            <p>Management System</p>
          </div>
        </div>

        <div className="nav-menu">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={activeTab === 'dashboard' ? 'active' : ''}
            data-testid="nav-dashboard"
          >
            <Home size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('new-donation')}
            className={activeTab === 'new-donation' ? 'active' : ''}
            data-testid="nav-new-donation"
          >
            <PlusCircle size={20} />
            New Donation
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={activeTab === 'donations' ? 'active' : ''}
            data-testid="nav-donations-list"
          >
            <List size={20} />
            All Donations
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'active' : ''}
              data-testid="nav-users"
            >
              <Users size={20} />
              Users
            </button>
          )}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <button onClick={logout} className="logout-btn" data-testid="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="main-content">
          {activeTab === 'dashboard' && (
            <div className="welcome-section">
              <h2>Welcome, {user?.name}! 🙏</h2>
              <p>Manage temple donations efficiently and track all contributions</p>
              <div className="quick-stats">
                <DonationList refresh={refreshKey} />
              </div>
            </div>
          )}

          {activeTab === 'new-donation' && (
            <DonationForm onSuccess={handleDonationSuccess} />
          )}

          {activeTab === 'donations' && (
            <DonationList refresh={refreshKey} />
          )}

          {activeTab === 'users' && isAdmin && (
            <UserManagement />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;