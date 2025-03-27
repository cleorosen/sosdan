let count = 0;
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'count.json');

try {
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath);
    count = JSON.parse(data).count;
  } else {
    fs.writeFileSync(dataPath, JSON.stringify({ count: 0 }));
  }
} catch (error) {
  console.error('Error initializing counter:', error);
}

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    };
  }

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
  
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
