import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';

const MainLayout = () => {
  const { isAuthenticated, role } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activePortal, setActivePortal] = useState(() => (role === 'ADMIN' ? 'ADMIN' : 'STUDENT'));

  React.useEffect(() => {
    if (role === 'ADMIN') {
      setActivePortal('ADMIN');
    } else {
      setActivePortal('STUDENT');
    }
  }, [role]);

  return (
    <div className="app-container">
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        activePortal={activePortal}
        setActivePortal={setActivePortal}
      />

      <main className="main-content">
        {isAuthenticated ? (
          role === 'ADMIN' || activePortal === 'ADMIN' ? (
            <AdminDashboard />
          ) : (
            <StudentDashboard />
          )
        ) : (
          /* Unauthenticated Landing / Hero View */
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-full)',
              color: '#818cf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
            }}>
              ⚡ POWERED BY SPRING BOOT & JWT SECURITY
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Next-Gen Digital Library &<br />
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Smart Transaction System
              </span>
            </h1>

            <p style={{
              maxWidth: '620px',
              margin: '0 auto 2.5rem auto',
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
            }}>
              Seamless book issuance, live fine calculations, distributed Redis caching, and role-based access control for students and librarians.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Get Started / Sign In →
              </button>
            </div>

            {/* Feature Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '4.5rem',
              textAlign: 'left',
            }}>
              <div className="glass-card glass-card-interactive">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🔐</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Stateless JWT Security</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  HMAC-SHA256 token verification with role-based route gating for Student and Admin endpoints.
                </p>
              </div>

              <div className="glass-card glass-card-interactive">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>⚡</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Redis Cloud Caching</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  High-speed cache-aside layer delivering sub-millisecond student record lookups with 1-hour TTL.
                </p>
              </div>

              <div className="glass-card glass-card-interactive">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>📜</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Automated Fine Engine</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  15-day borrowing window with automated ₹100/day penalty calculation and persistent UUID tracking.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}>
        AthenaLib System • Connected to Spring Boot Server at <code>http://localhost:8080</code>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}
