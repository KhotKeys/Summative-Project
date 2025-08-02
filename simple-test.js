// Simple endpoint test using Node.js built-in modules
const http = require('http');

function testEndpoint(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback(null, { status: res.statusCode, data: data });
    });
  });

  req.on('error', (err) => {
    callback(err, null);
  });

  req.setTimeout(5000, () => {
    req.destroy();
    callback(new Error('Request timeout'), null);
  });

  req.end();
}

console.log('🧪 Testing API endpoints...\n');

const endpoints = [
  '/api/courses/test',
  '/api/courses/offerings',
  '/api/activities/logs'
];

let completed = 0;
const results = [];

endpoints.forEach((endpoint, index) => {
  console.log(`📡 Testing ${endpoint}...`);
  
  testEndpoint(endpoint, (err, result) => {
    completed++;
    
    if (err) {
      console.log(`❌ ${endpoint} - Error: ${err.message}`);
      results.push({ endpoint, status: 'error', error: err.message });
    } else {
      if (result.status === 200) {
        console.log(`✅ ${endpoint} - Status: ${result.status} - OK`);
        results.push({ endpoint, status: 'success', httpStatus: result.status });
      } else {
        console.log(`⚠️  ${endpoint} - Status: ${result.status}`);
        console.log(`   Response: ${result.data.substring(0, 200)}...`);
        results.push({ endpoint, status: 'warning', httpStatus: result.status, response: result.data.substring(0, 100) });
      }
    }
    
    if (completed === endpoints.length) {
      console.log('\n📊 Test Summary:');
      results.forEach(r => {
        console.log(`   ${r.endpoint}: ${r.status} ${r.httpStatus ? `(${r.httpStatus})` : ''}`);
      });
      console.log('\n🎉 Testing complete!');
    }
  });
});
