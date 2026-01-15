// src/utils/api.js
import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api/v1';

// Create an axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Function to set the JWT token in headers
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

// Request interceptor to attach JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Response interceptor to handle global errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized, possibly token expired
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userData');
                window.location.href = '/login'; // Redirect to login
            }
        }
        return Promise.reject(error);
    } 
);

// Centralize error translation
export const getErrorMessage = (error) => {
    if (!error.response) {
        return "Network error. Please check your connection.";
    }

    const status = error.response.status;

    if (status === 400) return "Please check your input.";
    if (status === 401) return "Your session expired. Please log in again.";
    if (status === 403) return "You don't have permission to do that.";
    if (status === 404) return "Requested resource not found.";

    return "Something went wrong. Please try again.";
};

export default api;