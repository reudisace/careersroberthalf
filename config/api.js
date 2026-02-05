// API Configuration
const API_CONFIG = {
  // Single backend URL for both API and Socket.IO
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BACKEND_URL;
  var url = `${baseUrl}${endpoint}`;
  return url;
};

// Helper function to get Socket.IO URL (same as backend URL)
export const getSocketUrl = () => {
  return API_CONFIG.BACKEND_URL;
};
