import React, { useState, useEffect } from 'react';
import { authAPI, mandirAPI } from '../services/api'; // Import mandirAPI
import toast from 'react-hot-toast';
import { UserPlus, X } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [mandirs, setMandirs] = useState([]); // Store mandirs list
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'staff',
    mandirId: '' // Add mandirId
  });

  useEffect(() => {
    fetchUsers();
    fetchMandirs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchMandirs = async () => {
    try {
      const response = await mandirAPI.getList();
      setMandirs(response.data);
      // Auto-select first mandir if available
      if(response.data.length > 0) {
        setFormData(prev => ({ ...prev, mandirId: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Failed to fetch mandirs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.createUser(formData);
      toast.success('User created successfully');
      setShowForm(false);
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 'staff',
        mandirId: mandirs.length > 0 ? mandirs[0]._id : ''
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management-container">
      <div className="management-header">
        <div>
          <h2>User Management</h2>
          <p>Manage staff and admin users</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="add-user-btn"
        >
          {showForm ? <X size={20} /> : <UserPlus size={20} />}
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="user-form-card">
          <h3>Create New User</h3>
          <form onSubmit={handleSubmit} className="user-form">
            
            {/* Added Mandir Selection */}
            <div className="form-group" style={{marginBottom: '1rem'}}>
               <label htmlFor="mandirSelect">Select Mandir *</label>
               <select
                 id="mandirSelect"
                 value={formData.mandirId}
                 onChange={(e) => setFormData({...formData, mandirId: e.target.value})}
                 required
                 style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
               >
                 <option value="">-- Select Mandir --</option>
                 {mandirs.map(m => (
                   <option key={m._id} value={m._id}>{m.name}</option>
                 ))}
               </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="create-user-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>All Users ({users.length})</h3>
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{user.name}</h4>
                <p className="username">@{user.username}</p>
                {/* Display Mandir Name */}
                <p style={{fontSize: '0.85rem', color: '#666'}}>🛕 {user.mandir?.name || 'Unknown Mandir'}</p>
                
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? '🔑 Admin' : '👥 Staff'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;