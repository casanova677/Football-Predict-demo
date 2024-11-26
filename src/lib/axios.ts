import axios from "axios";


// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Prefix all requests with this base path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors to attach token for authenticated requests (if needed)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
