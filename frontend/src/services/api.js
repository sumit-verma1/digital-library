const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('lib_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    if (typeof data === 'object' && data !== null) {
      errorMessage = data.message || data.error || JSON.stringify(data);
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }
    throw new Error(errorMessage);
  }

  return data;
};

export const api = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Student Endpoints
  createStudent: async (studentData) => {
    const response = await fetch(`${BASE_URL}/student/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(response);
  },

  getStudentProfile: async () => {
    const response = await fetch(`${BASE_URL}/student/get`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStudentProfile: async (updateData) => {
    const response = await fetch(`${BASE_URL}/student/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  deleteStudentAccount: async () => {
    const response = await fetch(`${BASE_URL}/student/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getStudentByAdmin: async (id) => {
    const response = await fetch(`${BASE_URL}/student/get/admin?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Book Endpoints
  createBook: async (bookData) => {
    const response = await fetch(`${BASE_URL}/book/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    return handleResponse(response);
  },

  getBook: async (id) => {
    const response = await fetch(`${BASE_URL}/book/get?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Transaction Endpoints
  initiateTransaction: async (bookId, transactionType) => {
    const url = `${BASE_URL}/txn/initiate?bookId=${encodeURIComponent(bookId)}&transactionType=${encodeURIComponent(transactionType)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Admin Management
  createAdmin: async (adminData) => {
    const response = await fetch(`${BASE_URL}/admin/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },
};
