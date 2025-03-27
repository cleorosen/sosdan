// Configuration settings for the SOS Brigade website
const CONFIG = {
  // API endpoint for the visitor counter
  // When deploying to production, change this to your actual API endpoint
  // For example: 'https://your-site.netlify.app/.netlify/functions/counter'
  COUNTER_API_URL: '/api/counter',
  
  // Fallback mode in case the API is unavailable
  // Options: 'local' (use localStorage), 'simulate' (simulate increasing numbers)
  COUNTER_FALLBACK_MODE: 'local',
  
  // How often to refresh the counter (in milliseconds)
  COUNTER_REFRESH_INTERVAL: 300000, // 5 minutes
};
