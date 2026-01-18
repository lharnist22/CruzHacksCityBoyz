import { readFileSync } from 'fs';

// Read .dev.vars file
const devVars = readFileSync('.dev.vars', 'utf8');
const vars = {};
devVars.split('\n').forEach(line => {
  const match = line.match(/^([A-Z_]+)="([^"]*)"$/);
  if (match) {
    vars[match[1]] = match[2];
  }
});

const accountSid = vars.TWILIO_ACCOUNT_SID;
const authToken = vars.TWILIO_AUTH_TOKEN;
const fromNumber = vars.TWILIO_PHONE_NUMBER;
const toNumber = '+19252143805'; // Your phone number

console.log('🔑 Using Twilio Account SID:', accountSid?.substring(0, 8) + '...');
console.log('📞 From (Twilio):', fromNumber);
console.log('📱 To (You):', toNumber);

const auth = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
const formData = new URLSearchParams();
formData.append('To', toNumber);
formData.append('From', fromNumber);
formData.append('Body', '🚨 TEST: SafeWatch SMS notification system is working! If you get this, the system works!');

console.log('\n📤 Sending test SMS...');

try {
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const text = await response.text();
  console.log('📊 Status Code:', response.status);
  
  if (response.ok) {
    console.log('✅ SUCCESS: SMS sent! Check your phone.');
    try {
      const data = JSON.parse(text);
      console.log('📱 Message SID:', data.sid);
      console.log('🔄 Status:', data.status);
      console.log('💰 Price:', data.price);
    } catch (e) {
      console.log('📄 Response:', text.substring(0, 200));
    }
  } else {
    console.error('❌ FAILED: Could not send SMS');
    console.log('📄 Error Response:', text);
    
    // Try to parse error
    try {
      const error = JSON.parse(text);
      console.log('🚨 Error Code:', error.code);
      console.log('📝 Message:', error.message);
      console.log('🔗 More Info:', error.more_info);
    } catch (e) {
      // Not JSON
    }
  }
} catch (error) {
  console.error('❌ NETWORK ERROR:', error.message);
}
