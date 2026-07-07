const https = require('https');

const FIREBASE_URL = 'https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/security_logs.json';

function getRealIp(req) {
  // Try multiple headers to find the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return req.headers['x-real-ip'] 
    || req.connection?.remoteAddress 
    || req.socket?.remoteAddress 
    || req.ip 
    || 'unknown';
}

function logEvent(req, action, email) {
  const rawIp = getRealIp(req);
  
  // Clean IPv6 prefix (::ffff:192.168.1.10 → 192.168.1.10)
  const cleanIp = rawIp.replace(/^::ffff:/, '');
  
  console.log(`🔵 Raw IP: ${rawIp} | Clean IP: ${cleanIp}`);
  
  const data = JSON.stringify({
    websiteId: 'site_001',
    action: action,
    email: email || 'unknown',
    ip: cleanIp,
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
      console.log(`✅ Log sent: ${action} | ${email} | IP: ${cleanIp}`);
    } else {
      console.error(`❌ Log failed: ${res.statusCode}`);
    }
  });

  request.on('error', (err) => console.error('❌ Error:', err.message));
  request.write(data);
  request.end();
}

module.exports = { logEvent };
