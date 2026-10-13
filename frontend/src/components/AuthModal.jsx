import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const { addToast } = useToast();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Student form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGender, setRegGender] = useState('MALE');

  // Register Admin form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.login({
        username: loginUsername.trim(),
        password: loginPassword,
      });

      login(data);
      addToast(`Welcome back, ${data.username}! Authenticated as ${data.authority || 'STUDENT'}.`, 'success');
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
      addToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createStudent({
        username: regUsername.trim(),
        password: regPassword,
        name: regName.trim(),
        email: regEmail.trim(),
        gender: regGender,
      });

      addToast('Student account created successfully! Please sign in.', 'success');
      setLoginUsername(regUsername.trim());
      setLoginPassword('');
      setActiveTab('login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      addToast(err.message || 'Registration error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const adminId = await api.createAdmin({
        username: adminUsername.trim(),
        password: adminPassword,
        name: adminName.trim(),
      });

      addToast(`Administrator account created (ID: #${adminId})! Please sign in.`, 'success');
      setLoginUsername(adminUsername.trim());
      setLoginPassword('');
      setActiveTab('login');
    } catch (err) {
      setError(err.message || 'Admin registration failed.');
      addToast(err.message || 'Admin registration error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {activeTab === 'login' && 'Sign In to AthenaLib'}
            {activeTab === 'registerStudent' && 'Register New Student'}
            {activeTab === 'registerAdmin' && 'Register New Administrator'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${activeTab === 'registerStudent' ? 'active' : ''}`}
            onClick={() => { setActiveTab('registerStudent'); setError(null); }}
          >
            Student Sign Up
          </button>
          <button
            className={`tab-btn ${activeTab === 'registerAdmin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('registerAdmin'); setError(null); }}
          >
            Admin Sign Up
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. admin_ram or fantasm123"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In with JWT'}
            </button>
          </form>
        )}

        {activeTab === 'registerStudent' && (
          <form onSubmit={handleRegisterStudent}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. rahul123"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. rahul@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Choose a strong password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register Student Account'}
            </button>
          </form>
        )}

        {activeTab === 'registerAdmin' && (
          <form onSubmit={handleRegisterAdmin}>
            <div className="form-group">
              <label className="form-label">Administrator Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. admin_sarah"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Choose a secure password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Admin...' : 'Register Administrator'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
