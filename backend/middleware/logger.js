const https = require('https');

const FIREBASE_URL = 'https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/security_logs.json';

function parseDevice(userAgent) {
  if (!userAgent) return 'Unknown';

  let browser = 'Unknown';
  if (userAgent.includes('Edg/')) browser = 'Edge';
  else if (userAgent.includes('Chrome/')) browser = 'Chrome';
  else if (userAgent.includes('Firefox/')) browser = 'Firefox';
  else if (userAgent.includes('Safari/')) browser = 'Safari';
  else if (userAgent.includes('Opera/')) browser = 'Opera';

  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

function formatTime(date) {
  const d = date || new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function getRealIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  const raw = req.headers['x-real-ip'] || req.ip || 'unknown';
  return raw.replace(/^::ffff:/, '');
}

function logEvent(req, action, email) {
  const shortDevice = parseDevice(req.headers['user-agent']);
  const shortTime = formatTime(new Date());
  const realIp = getRealIp(req);
  
  // DEBUG: Show what we're sending
  console.log(`🔵 DEBUG - Device: ${shortDevice}`);
  console.log(`🔵 DEBUG - Time: ${shortTime}`);
  console.log(`🔵 DEBUG - IP: ${realIp}`);

  const data = JSON.stringify({
    websiteId: 'site_001',
    action: action,
    email: email || 'unknown',
    ip: realIp,
    device: shortDevice,
    time: shortTime
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
      console.error(`❌ Log failed: ${res.statusCode}`);
    }
  });

  request.on('error', (err) => console.error('❌ Error:', err.message));
  request.write(data);
  request.end();
}

module.exports = { logEvent };
