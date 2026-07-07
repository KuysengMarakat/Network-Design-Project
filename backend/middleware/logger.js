const https = require('https');

const FIREBASE_URL = 'https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/security_logs.json';

// ─────────────────────────────────────
// Helper: Parse user-agent to short name
// ─────────────────────────────────────
function parseDevice(userAgent) {
  if (!userAgent) return 'Unknown';

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Edg/')) browser = 'Edge';
  else if (userAgent.includes('Chrome/')) browser = 'Chrome';
  else if (userAgent.includes('Firefox/')) browser = 'Firefox';
  else if (userAgent.includes('Safari/')) browser = 'Safari';
  else if (userAgent.includes('Opera/')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

// ─────────────────────────────────────
// Helper: Format time to short readable
// ─────────────────────────────────────
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

// ─────────────────────────────────────
// Helper: Get real IP
// ─────────────────────────────────────
function getRealIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  const raw = req.headers['x-real-ip'] || req.ip || 'unknown';
  return raw.replace(/^::ffff:/, '');
}

// ─────────────────────────────────────
// Main logger function
// ─────────────────────────────────────
function logEvent(req, action, email) {
  const data = JSON.stringify({
    websiteId: 'site_001',
    action: action,
    email: email || 'unknown',
    ip: getRealIp(req),
    device: parseDevice(req.headers['user-agent']),
    time: formatTime(new Date())
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
