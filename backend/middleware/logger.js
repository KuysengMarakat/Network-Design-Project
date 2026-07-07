
// Simple logger - HTTP POST to Firebase Realtime Database
const https = require('https');

const FIREBASE_URL = 'https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/security_logs.json';

function logEvent(req, action, email) {
  const data = JSON.stringify({
    websiteId: 'site_001',
    action: action,
    email: email || 'unknown',
    ip: req.ip || 'unknown',
    device: req.headers['user-agent'] || 'unknown',
    time: new Date().toISOString()
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = https.request(FIREBASE_URL, options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Log sent: ${action} | ${email}`);
    } else {
      console.error(`❌ Log failed: status ${res.statusCode}`);
    }
  });

  request.on('error', (err) => console.error('❌ Log error:', err.message));
  request.write(data);
  request.end();
}

module.exports = { logEvent };
