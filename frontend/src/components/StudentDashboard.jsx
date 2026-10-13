import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Book issue input
  const [issueBookId, setIssueBookId] = useState('');
  const [bookPreview, setBookPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Profile update modal/state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState('MALE');
  const [isEditing, setIsEditing] = useState(false);

  const { addToast } = useToast();
  const { logout } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getStudentProfile();
      if (data && data.student) {
        setProfile(data.student);
        setEditName(data.student.name || '');
        setEditEmail(data.student.email || '');
        setEditGender(data.student.gender || 'MALE');
      }
    } catch (err) {
      addToast(`Failed to load student profile: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Book Lookup preview
  const handleLookupBook = async (e) => {
    e.preventDefault();
    if (!issueBookId) return;
    setPreviewLoading(true);
    setBookPreview(null);
    try {
      const data = await api.getBook(issueBookId);
      if (data && data.book) {
        setBookPreview(data.book);
      } else {
        addToast(`No book found with ID ${issueBookId}`, 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Issue Book
  const handleIssueBook = async (bookIdToIssue) => {
    const id = bookIdToIssue || issueBookId;
    if (!id) return;
    setActionLoading(true);
    try {
      const txnId = await api.initiateTransaction(id, 'ISSUANCE');
      addToast(`Book #${id} issued successfully! Transaction ID: ${txnId}`, 'success', 6000);
      setIssueBookId('');
      setBookPreview(null);
      await fetchProfile();
    } catch (err) {
      addToast(`Issuance failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Return Book
  const handleReturnBook = async (bookId) => {
    if (!window.confirm(`Are you sure you want to return Book #${bookId}?`)) return;
    setActionLoading(true);
    try {
      const txnId = await api.initiateTransaction(bookId, 'RETURN');
      addToast(`Book #${bookId} returned successfully! Transaction ID: ${txnId}`, 'success', 6000);
      await fetchProfile();
    } catch (err) {
      addToast(`Return failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.updateStudentProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        gender: editGender,
      });
      addToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      addToast(`Update failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Deactivate Account
  const handleDeactivate = async () => {
    if (!window.confirm('WARNING: Are you sure you want to deactivate your student account? You will be signed out.')) return;
    setActionLoading(true);
    try {
      await api.deleteStudentAccount();
      addToast('Account deactivated successfully.', 'info');
      logout();
    } catch (err) {
      addToast(`Deactivation failed: ${err.message}`, 'error');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loading Student Dashboard...</div>
        <div>Connecting to library service on port 8080</div>
      </div>
    );
  }

  const issuedBooks = profile?.books || [];
  const quotaLimit = 3;
  const remainingQuota = quotaLimit - issuedBooks.length;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2>Welcome, {profile?.name || 'Student'}</h2>
            <span className={`badge ${profile?.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
              {profile?.status || 'ACTIVE'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            ID: #{profile?.id} • {profile?.email} • {profile?.gender}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDeactivate} disabled={actionLoading}>
            Deactivate
          </button>
        </div>
      </div>

      {/* Profile Edit Panel */}
      {isEditing && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Update Profile Details</h4>
          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              <select className="form-select" value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon stat-icon-indigo">📚</div>
          <div>
            <div className="stat-value">{issuedBooks.length} / {quotaLimit}</div>
            <div className="stat-label">Currently Borrowed</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon stat-icon-cyan">✨</div>
          <div>
            <div className="stat-value">{remainingQuota}</div>
            <div className="stat-label">Remaining Quota</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon stat-icon-emerald">⏳</div>
          <div>
            <div className="stat-value">15 Days</div>
            <div className="stat-label">Borrowing Period</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon stat-icon-amber">💰</div>
          <div>
            <div className="stat-value">₹100 / day</div>
            <div className="stat-label">Overdue Fine Rate</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Issue Book Panel */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.5rem' }}>Borrow a Book</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Enter a Book ID to inspect its details and initiate instant borrowing.
          </p>

          <form onSubmit={handleLookupBook} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Enter Book ID (e.g. 1)"
              value={issueBookId}
              onChange={(e) => setIssueBookId(e.target.value)}
              required
              min="1"
            />
            <button type="submit" className="btn btn-secondary" disabled={previewLoading || !issueBookId}>
              {previewLoading ? 'Checking...' : 'Lookup'}
            </button>
          </form>

          {bookPreview && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{bookPreview.name}</span>
                <span className="badge badge-genre">{bookPreview.genre}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Author: {bookPreview.author?.name || 'Unknown'} ({bookPreview.author?.email || 'N/A'})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: bookPreview.student ? '#fb7185' : '#34d399' }}>
                  {bookPreview.student ? `Already assigned to Student #${bookPreview.student.id}` : '✓ Available to Borrow'}
                </span>
                {!bookPreview.student && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleIssueBook(bookPreview.id)}
                    disabled={actionLoading || remainingQuota <= 0}
                  >
                    {actionLoading ? 'Issuing...' : 'Issue Book Now'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Library Borrowing Guidelines Card */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.75rem' }}>Borrowing Rules</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <span><strong>Quota Limit:</strong> Up to 3 active books simultaneously per student account.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>•</span>
              <span><strong>Grace Window:</strong> Keep any borrowed book for up to 15 days without penalty.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-amber)' }}>•</span>
              <span><strong>Overdue Fine:</strong> Automatic fine of ₹100 per day past the 15-day limit upon return.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>•</span>
              <span><strong>Audit Tracking:</strong> Every transaction generates a persistent UUID tracking code.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* My Borrowed Books Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>My Borrowed Books ({issuedBooks.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={fetchProfile} disabled={loading}>
            Refresh
          </button>
        </div>

        {issuedBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
            <p>You have no active book loans. Use the panel above to borrow a book by ID!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Author</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{book.id}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{book.name}</td>
                    <td>
                      <span className="badge badge-genre">{book.genre}</span>
                    </td>
                    <td>
                      <div>{book.author?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.author?.email || ''}</div>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReturnBook(book.id)}
                        disabled={actionLoading}
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
