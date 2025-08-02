// Quick test script to verify endpoints are working
const fetch = require('node-fetch');

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/courses/test',
    '/api/courses/offerings',
    '/api/activities/logs',
    '/api/admin/modules'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint}...`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${endpoint} - Status: ${status} - OK`);
      } else {
        console.log(`❌ ${endpoint} - Status: ${status} - Error`);
        const text = await response.text();
        console.log(`   Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`🔥 ${endpoint} - Connection Error: ${error.message}`);
    }
    console.log('');
  }
}

// Check if server is running first
fetch('http://localhost:3000/api/courses/test')
  .then(() => {
    console.log('🚀 Server is running, starting tests...\n');
    testEndpoints();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start with: npm start');
  });
