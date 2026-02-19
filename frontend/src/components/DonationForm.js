import React, { useState } from 'react';
import { donationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import Receipt from './Receipt';
import './DonationForm.css';

const DonationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    donorName: '',
    address: '',
    phoneNumber: '',
    amount: '',
    donationDate: new Date().toISOString().split('T')[0],
    donationType: 'Go Sanrakshan Daan',
    paymentStatus: 'Received',
  });
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [createdDonation, setCreatedDonation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX: Changed .create to .createDonation
      const response = await donationAPI.createDonation(formData); 
      setCreatedDonation(response.data.donation);
      setShowReceipt(true);
      toast.success('Donation recorded successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record donation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDonation = () => {
    setShowReceipt(false);
    setCreatedDonation(null);
    setFormData({
      donorName: '',
      address: '',
      phoneNumber: '',
      amount: '',
      donationDate: new Date().toISOString().split('T')[0],
      donationType: 'Go Sanrakshan Daan',
      paymentStatus: 'Received',
    });
  };

  if (showReceipt && createdDonation) {
    return (
      <Receipt 
        donation={createdDonation} 
        onClose={handleNewDonation}
      />
    );
  }

  return (
    <div className="donation-form-container">
      <div className="form-header">
        <h2>New Donation Entry</h2>
        <p>Enter donor and donation details</p>
      </div>

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-section">
          <h3>👤 Donor Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="donorName">Donor Name *</label>
              <input
                type="text"
                id="donorName"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                placeholder="Enter donor's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete address"
              rows="3"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>💰 Donation Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="donationDate">Date *</label>
              <input
                type="date"
                id="donationDate"
                value={formData.donationDate}
                onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="donationType">Donation Type *</label>
              <select
                id="donationType"
                value={formData.donationType}
                onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                required
              >
                <option value="Go Sanrakshan Daan">Go Sanrakshan Daan</option>
                <option value="Mandir Nirman">Mandir Nirman</option>
                <option value="Mandir Sanrakshan">Mandir Sanrakshan</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentStatus">Payment Status *</label>
              <select
                id="paymentStatus"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                required
              >
                <option value="Received">Received</option>
                <option value="Pledged">Pledged (Pay Later)</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (
            <>
              <Save size={20} />
              Save Donation
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;