import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mandirAPI } from '../services/api'; 
import { Link } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', mandirId: '' });
  const [mandirs, setMandirs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const fetchMandirs = async () => {
      try {
        const response = await mandirAPI.getList();
        setMandirs(response.data);
        if (response.data.length > 0) {
           setCredentials(prev => ({ ...prev, mandirId: response.data[0]._id }));
        }
      } catch (error) {
        toast.error('Failed to load Mandir list');
      }
    };
    fetchMandirs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.mandirId) {
        return toast.error('Please select a Mandir');
    }
    setLoading(true);

    try {
      await login(credentials);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="temple-icon">🕉️</div>
          <h1>Mandir Donation System</h1>
          <p>Temple Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="mandir">Select Mandir</label>
            <select
              id="mandir"
              value={credentials.mandirId}
              onChange={(e) => setCredentials({ ...credentials, mandirId: e.target.value })}
              required
              className="form-select" 
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem'}}
            >
              <option value="">-- Select Your Mandir --</option>
              {mandirs.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : <><LogIn size={20} /> Login</>}
          </button>
        </form>

        <div className="login-footer">
           <p style={{marginTop: '1rem'}}>
             New Temple? <Link to="/register-mandir" style={{color: '#e53e3e', fontWeight: 'bold'}}>Register here</Link>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
