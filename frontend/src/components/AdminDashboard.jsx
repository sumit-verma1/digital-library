import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from './Toast';

export const AdminDashboard = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Add Book State
  const [bookTitle, setBookTitle] = useState('');
  const [bookGenre, setBookGenre] = useState('JAVA');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  // Lookup Student State
  const [lookupStudentId, setLookupStudentId] = useState('');
  const [studentResult, setStudentResult] = useState(null);
  const [studentLookupLoading, setStudentLookupLoading] = useState(false);

  // Lookup Book State
  const [lookupBookId, setLookupBookId] = useState('');
  const [bookResult, setBookResult] = useState(null);
  const [bookLookupLoading, setBookLookupLoading] = useState(false);

  // Create Admin State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  // Handle Add Book
  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.createBook({
        name: bookTitle.trim(),
        genre: bookGenre,
        authorName: authorName.trim(),
        email: authorEmail.trim(),
      });

      const bookId = data?.book?.id || 'Created';
      addToast(`Book "${bookTitle}" created successfully with ID #${bookId}!`, 'success');
      setBookTitle('');
      setAuthorName('');
      setAuthorEmail('');
    } catch (err) {
      addToast(`Failed to add book: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Lookup Student
  const handleLookupStudent = async (e) => {
    e.preventDefault();
    if (!lookupStudentId) return;
    setStudentLookupLoading(true);
    setStudentResult(null);

    try {
      const data = await api.getStudentByAdmin(lookupStudentId);
      if (data && data.student) {
        setStudentResult(data.student);
        addToast(`Found student #${lookupStudentId}`, 'info');
      } else {
        addToast(`No student found with ID ${lookupStudentId}`, 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setStudentLookupLoading(false);
    }
  };

  // Handle Lookup Book
  const handleLookupBook = async (e) => {
    e.preventDefault();
    if (!lookupBookId) return;
    setBookLookupLoading(true);
    setBookResult(null);

    try {
      const data = await api.getBook(lookupBookId);
      if (data && data.book) {
        setBookResult(data.book);
        addToast(`Found book #${lookupBookId}`, 'info');
      } else {
        addToast(`No book found with ID ${lookupBookId}`, 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setBookLookupLoading(false);
    }
  };

  // Handle Create Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adminId = await api.createAdmin({
        username: adminUsername.trim(),
        password: adminPassword,
        name: adminName.trim(),
      });
      addToast(`Administrator created successfully with ID #${adminId}!`, 'success');
      setAdminUsername('');
      setAdminPassword('');
      setAdminName('');
    } catch (err) {
      addToast(`Failed to create admin: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Admin Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h2>Administrator Control Center</h2>
          <span className="badge badge-admin">ADMINISTRATOR</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage catalog inventory, register books and authors, audit student accounts, and grant administrative access.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Add Book & Author Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.5rem' }}>Add New Book to Catalog</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Registers a new title and automatically associates/creates its author.
          </p>

          <form onSubmit={handleAddBook}>
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Effective Java 3rd Edition"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" value={bookGenre} onChange={(e) => setBookGenre(e.target.value)}>
                <option value="JAVA">JAVA</option>
                <option value="MATHS">MATHS</option>
                <option value="PHYSICS">PHYSICS</option>
                <option value="MUSIC">MUSIC</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Joshua Bloch"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. joshua@bloch.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Saving Book...' : '+ Add Book & Author'}
            </button>
          </form>
        </div>

        {/* Student Lookup & Audit */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.5rem' }}>Student Account Audit</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Look up any registered student by ID to inspect status and active loans.
          </p>

          <form onSubmit={handleLookupStudent} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Enter Student ID"
              value={lookupStudentId}
              onChange={(e) => setLookupStudentId(e.target.value)}
              required
              min="1"
            />
            <button type="submit" className="btn btn-secondary" disabled={studentLookupLoading || !lookupStudentId}>
              {studentLookupLoading ? 'Searching...' : 'Audit'}
            </button>
          </form>

          {studentResult && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{studentResult.name}</span>
                <span className={`badge ${studentResult.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                  {studentResult.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                <div><strong>Student ID:</strong> #{studentResult.id}</div>
                <div><strong>Email:</strong> {studentResult.email}</div>
                <div><strong>Gender:</strong> {studentResult.gender}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Currently Borrowed Books ({studentResult.books?.length || 0}):
                </div>
                {studentResult.books?.length > 0 ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                    {studentResult.books.map((b) => (
                      <li key={b.id} style={{ padding: '0.4rem 0.6rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                        #{b.id} - <strong>{b.name}</strong> ({b.genre})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No books currently assigned.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {/* Book Availability Inspector */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.5rem' }}>Book Inventory Inspector</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Check book metadata, author details, and current borrower assignment.
          </p>

          <form onSubmit={handleLookupBook} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Enter Book ID"
              value={lookupBookId}
              onChange={(e) => setLookupBookId(e.target.value)}
              required
              min="1"
            />
            <button type="submit" className="btn btn-secondary" disabled={bookLookupLoading || !lookupBookId}>
              {bookLookupLoading ? 'Searching...' : 'Inspect'}
            </button>
          </form>

          {bookResult && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{bookResult.name}</span>
                <span className="badge badge-genre">{bookResult.genre}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong>Book ID:</strong> #{bookResult.id}</div>
                <div><strong>Author:</strong> {bookResult.author?.name || 'N/A'} ({bookResult.author?.email || 'N/A'})</div>
                <div>
                  <strong>Borrower Status:</strong>{' '}
                  <span style={{ color: bookResult.student ? '#fb7185' : '#34d399', fontWeight: 600 }}>
                    {bookResult.student ? `Assigned to Student #${bookResult.student.id} (${bookResult.student.name})` : 'On Shelf (Available)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Co-Admin Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '0.5rem' }}>Register New Co-Administrator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Grants full administrative privileges to a new staff member.
          </p>

          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
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
              <label className="form-label">Username</label>
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
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating...' : '+ Register Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
