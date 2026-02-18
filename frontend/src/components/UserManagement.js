import React, { useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, X } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'staff',
  });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
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
          data-testid="add-user-button"
        >
          {showForm ? <X size={20} /> : <UserPlus size={20} />}
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="user-form-card">
          <h3>Create New User</h3>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  data-testid="user-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  data-testid="user-username-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
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
                  data-testid="user-password-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  data-testid="user-role-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="create-user-btn" 
              disabled={loading}
              data-testid="create-user-submit"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>All Users ({users.length})</h3>
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card" data-testid="user-card">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{user.name}</h4>
                <p className="username">@{user.username}</p>
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