// middleware/ping.js

const fetch = require('node-fetch'); 
// OR use built-in: const https = require('https');

// Configuration
const WEBSITE_ID = "site_001";
const WEBSITE_NAME = "KhmerCharm";
const WEBSITE_DOMAIN = "khmercharm.com";
const FIREBASE_URL = "https://phneak-tep-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Function to send ping
async function sendPing() {
   try {
      const url = `${FIREBASE_URL}/websites/${WEBSITE_ID}.json`;
      
      const data = {
         name: WEBSITE_NAME,
         domain: WEBSITE_DOMAIN,
         isConnected: true,
         lastPing: new Date().toISOString(),
         status: "online"
      };
      
      const response = await fetch(url, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      });
      
      if (response.ok) {
         console.log(`✅ Ping sent at ${new Date().toISOString()}`);
      } else {
         console.error('❌ Ping failed');
      }
   } catch (error) {
      console.error('❌ Ping error:', error.message);
   }
}

// Start ping system
function startPingSystem() {
   console.log('🚀 Starting ping system...');
   
   // Send first ping immediately
   sendPing();
   
   // Then send every 5 minutes
   setInterval(sendPing, 5 * 60 * 1000);
   
   console.log('✅ Ping system running - will ping every 5 minutes');
}

// Export the function
module.exports = { startPingSystem, sendPing };
