const https = require('https');

const FIREBASE_URL = 'https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/security_logs.json';

function logEvent(req, action, email) {
  console.log(`\n🔵 ========== LOGGER CALLED ==========`);
  console.log(`🔵 Action: ${action}`);
  console.log(`🔵 Email: ${email}`);
  
  const data = JSON.stringify({
    websiteId: 'site_001',
    action: action,
    email: email || 'unknown',
    ip: req.ip || 'unknown',
    device: req.headers['user-agent'] || 'unknown',
    time: new Date().toISOString()
  });

  console.log(`🔵 Data: ${data}`);
  console.log(`🔵 URL: ${FIREBASE_URL}`);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = https.request(FIREBASE_URL, options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => responseData += chunk);
    res.on('end', () => {
      console.log(`🔵 Response status: ${res.statusCode}`);
      console.log(`🔵 Response body: ${responseData}`);
      console.log(`🔵 ================================\n`);
    });
  });

  request.on('error', (err) => {
    console.error(`❌ ERROR: ${err.message}`);
  });
  
  request.write(data);
  request.end();
  
  console.log(`🔵 Request sent, waiting for response...`);
}

module.exports = { logEvent };
