import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, activePortal, setActivePortal }) => {
  const { isAuthenticated, username, role, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
              <path d="M6 14h6" />
            </svg>
          </div>
          <div>
            <div className="brand-text">AthenaLib</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>Digital Library System</div>
          </div>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {role === 'STUDENT' && (
                  <button
                    className={`btn btn-sm ${activePortal === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActivePortal('STUDENT')}
                  >
                    Student Portal
                  </button>
                )}
                {role === 'ADMIN' && (
                  <button
                    className={`btn btn-sm ${activePortal === 'ADMIN' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActivePortal('ADMIN')}
                  >
                    Admin Portal
                  </button>
                )}
              </div>

              <div className="user-nav-profile">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{username}</span>
                  <span className={`badge ${role === 'ADMIN' ? 'badge-admin' : 'badge-student'}`}>
                    {role}
                  </span>
                </div>
                <button className="btn btn-sm btn-danger" onClick={logout} title="Sign Out">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
