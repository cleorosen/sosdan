const CONFIG = {
  // API endpoint for the visitor counter
  COUNTER_API_URL: '/api/counter',
  
  // Fallback mode in case the API is unavailable
  // Options: 'local' (use localStorage), 'simulate' (simulate increasing numbers)
  COUNTER_FALLBACK_MODE: 'local',
  
  COUNTER_REFRESH_INTERVAL: 300000, // 5 minutes
};
