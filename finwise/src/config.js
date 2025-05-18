const config = {
  // Use environment variable in production, fallback to localhost in development
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  // Frontend URL for CORS configuration
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'
};

export default config; 