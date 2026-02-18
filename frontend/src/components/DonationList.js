import React, { useState, useEffect } from 'react';
import { donationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Eye, Filter, CheckCircle, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import Receipt from './Receipt';
import './DonationList.css';

const DonationList = ({ refresh }) => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [filters, refresh]);

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getAll(filters);
      setDonations(response.data.donations);
    } catch (error) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await donationAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await donationAPI.updateStatus(id, newStatus);
      toast.success('Payment status updated');
      fetchDonations();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const viewReceipt = async (id) => {
    try {
      const response = await donationAPI.getById(id);
      setSelectedDonation(response.data.donation);
      setShowReceipt(true);
    } catch (error) {
      toast.error('Failed to load receipt');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (showReceipt && selectedDonation) {
    return (
      <Receipt 
        donation={selectedDonation} 
        onClose={() => {
          setShowReceipt(false);
          setSelectedDonation(null);
        }}
      />
    );
  }

  return (
    <div className="donation-list-container">
      {stats && (
        <div className="stats-grid" data-testid="donation-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e6f7ff' }}>
              <Users size={24} color="#1890ff" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Donations</p>
              <h3 className="stat-value">{stats.totalDonations}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0f9ff' }}>
              <DollarSign size={24} color="#0284c7" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Amount</p>
              <h3 className="stat-value">{formatAmount(stats.totalAmount)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle size={24} color="#16a34a" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Received</p>
              <h3 className="stat-value">{formatAmount(stats.receivedAmount)}</h3>
              <p className="stat-subtext">{stats.receivedDonations} donations</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb' }}>
              <Clock size={24} color="#d97706" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pledged</p>
              <h3 className="stat-value">{formatAmount(stats.pledgedAmount)}</h3>
              <p className="stat-subtext">{stats.pledgedDonations} donations</p>
            </div>
          </div>
        </div>
      )}

      <div className="list-header">
        <h2>All Donations</h2>
        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            data-testid="filter-status-select"
          >
            <option value="">All Status</option>
            <option value="Received">Received</option>
            <option value="Pledged">Pledged</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            data-testid="filter-type-select"
          >
            <option value="">All Types</option>
            <option value="Go Sanrakshan Daan">Go Sanrakshan Daan</option>
            <option value="Mandir Nirman">Mandir Nirman</option>
            <option value="Mandir Sanrakshan">Mandir Sanrakshan</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading donations...</div>
      ) : donations.length === 0 ? (
        <div className="no-data">No donations found</div>
      ) : (
        <div className="donations-table">
          <table>
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Donor Name</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} data-testid="donation-row">
                  <td className="receipt-no">{donation.receiptNumber}</td>
                  <td>{donation.donorName}</td>
                  <td>{donation.phoneNumber}</td>
                  <td className="amount">{formatAmount(donation.amount)}</td>
                  <td>
                    <span className="type-badge">{donation.donationType}</span>
                  </td>
                  <td>{formatDate(donation.donationDate)}</td>
                  <td>
                    <select
                      value={donation.paymentStatus}
                      onChange={(e) => handleStatusUpdate(donation._id, e.target.value)}
                      className={`status-select ${donation.paymentStatus.toLowerCase()}`}
                      data-testid="status-update-select"
                    >
                      <option value="Received">Received</option>
                      <option value="Pledged">Pledged</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => viewReceipt(donation._id)}
                      className="view-btn"
                      data-testid="view-receipt-button"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationList;