import React, { useState } from 'react';
import { mandirAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing Login CSS

const MandirRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mandirName: '',
    phoneNumber: '',
    contactPerson: '',
    username: '', 
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mandirAPI.register(formData);
      toast.success('Mandir registered successfully! Please login.');
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
          <p>Create your Temple Management Account</p>
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

          <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}} />
          <p style={{marginBottom: '15px', fontWeight: 'bold', textAlign: 'center'}}>Admin Account Details</p>

          <div className="form-group">
            <label>Admin Username *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register Mandir'}
          </button>
        </form>
        
        <div className="login-footer">
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default MandirRegistration;
