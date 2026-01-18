// Test the NotificationService directly
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock environment
const mockEnv = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  DB: {
    prepare: (query) => ({
      bind: (...params) => ({
        all: async () => ({
          results: [
            {
              id: 1,
              user_id: 'test-user-123',
              phone_number: '+19252143805', // Your corrected number
              notification_state: 'CA',
              notification_county: null,
              receive_sms_notifications: 1
            }
          ]
        })
      })
    })
  }
};

// Import and test
const { NotificationService } = await import('./src/worker/services/NotificationService.js');

const service = new NotificationService(mockEnv);

const testReport = {
  id: 1,
  location: 'Los Angeles, CA',
  state: 'CA',
  county: 'Los Angeles',
  date: '2026-01-17',
  time: '14:30',
  description: 'Test raid report for SMS notifications'
};

console.log('📋 Test report:', testReport);
console.log('🔍 Looking for users to notify...');

const users = await service.getUsersToNotify('CA', 'Los Angeles');
console.log('👥 Users found:', users.length);

if (users.length > 0) {
  console.log('📤 Sending test notification...');
  const result = await service.sendBulkNotifications(testReport);
  console.log('📊 Result:', result);
} else {
  console.log('❌ No users found to notify');
}
