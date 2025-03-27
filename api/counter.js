// Simple counter API using a JSON file for storage
// Can be deployed to Netlify, Vercel, or other serverless platforms

let count = 0;
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'count.json');

// Initialize or read the current count
try {
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath);
    count = JSON.parse(data).count;
  } else {
    // Initialize with count = 0
    fs.writeFileSync(dataPath, JSON.stringify({ count: 0 }));
  }
} catch (error) {
  console.error('Error initializing counter:', error);
}

// Function to handle HTTP requests
exports.handler = async function(event, context) {
  // Set CORS headers to allow requests from any origin
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Handle GET request - return current count
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    };
  }

  // Handle POST request - increment count
  if (event.httpMethod === 'POST') {
    count++;
    
    try {
      fs.writeFileSync(dataPath, JSON.stringify({ count }));
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      };
    } catch (error) {
      console.error('Error updating counter:', error);
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update counter' })
      };
    }
  }

  // Handle unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
