import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('lib_jwt_token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('lib_username') || null);
  const [role, setRole] = useState(() => localStorage.getItem('lib_role') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('lib_jwt_token', token);
    } else {
      localStorage.removeItem('lib_jwt_token');
    }
  }, [token]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('lib_username', username);
    } else {
      localStorage.removeItem('lib_username');
    }
  }, [username]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('lib_role', role);
    } else {
      localStorage.removeItem('lib_role');
    }
  }, [role]);

  const login = (authData) => {
    const authority = authData.authority || (authData.authorities ? authData.authorities : 'STUDENT');
    const primaryRole = authority.includes('ADMIN') ? 'ADMIN' : 'STUDENT';

    if (authData.token) {
      localStorage.setItem('lib_jwt_token', authData.token);
    }
    if (authData.username) {
      localStorage.setItem('lib_username', authData.username);
    }
    localStorage.setItem('lib_role', primaryRole);

    setToken(authData.token);
    setUsername(authData.username);
    setRole(primaryRole);
  };

  const logout = () => {
    localStorage.removeItem('lib_jwt_token');
    localStorage.removeItem('lib_username');
    localStorage.removeItem('lib_role');
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        role,
        setRole,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
