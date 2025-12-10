// src/lib/api.ts

import axios from 'axios';

// -----------------------------------------------------------
// Configuration
// -----------------------------------------------------------

// Set the base URL to your Flask backend server address
// NOTE: Flask is configured to run on port 5000 by default.
const API_BASE_URL = 'http://localhost:5000';

// -----------------------------------------------------------
// Create the Axios Instance
// -----------------------------------------------------------

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------
// Request Interceptor (Optional but Recommended)
// -----------------------------------------------------------
// Use this to automatically attach authorization tokens to every request
api.interceptors.request.use(
  (config) => {
    // Check if user is logged in and has a token (e.g., stored in localStorage)
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Use this to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Example: If a 401 is received, redirect to login
        if (error.response && error.response.status === 401) {
            // This is where you might log the user out and redirect
            console.warn("Unauthorized request. Token may be expired.");
            // Example: window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);


export default api;