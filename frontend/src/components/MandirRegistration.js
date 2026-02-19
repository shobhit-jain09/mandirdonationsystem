import React, { useState } from 'react';
import { mandirAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

const MandirRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mandirName: '',
    phoneNumber: '',
    email: '', // NEW: State for email
    contactPerson: '',
    address: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mandirAPI.register(formData);
      toast.success('Mandir registered successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h1>Register New Mandir</h1>
          <p>Create your Temple Profile</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Mandir Name *</label>
            <input
              type="text"
              required
              value={formData.mandirName}
              onChange={(e) => setFormData({...formData, mandirName: e.target.value})}
              placeholder="e.g. Shree Ram Mandir"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              placeholder="Official Contact Number"
            />
          </div>

          {/* NEW: Email Input Field */}
          <div className="form-group">
            <label>Email ID (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contact@mandir.com"
            />
          </div>

          <div className="form-group">
            <label>Contact Person Name *</label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              placeholder="Main Admin Name"
            />
          </div>

          <div className="form-group">
            <label>Complete Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter full temple address"
              rows="3"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading} style={{marginTop: '20px'}}>
            {loading ? 'Registering...' : 'Register Mandir'}
          </button>
        </form>
        
        <div className="login-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default MandirRegistration;