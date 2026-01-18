export class TwilioService {
  private baseUrl: string;
  private auth: string;

  constructor(
    private env: Env
  ) {
    // No need for twilio package - use direct API
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    // Basic auth for Twilio API
    this.auth = 'Basic ' + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  }

  async sendSMS(to: string, body: string): Promise<boolean> {
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', this.env.TWILIO_PHONE_NUMBER);
    formData.append('Body', body);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('❌ Twilio API error:', response.status, responseText);
        return false;
      }

      console.log('✅ SMS sent successfully to', to);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to send SMS:', error.message);
      return false;
    }
  }

  async sendBulkSMS(users: Array<{ phone_number: string }>, message: string): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;
    
    // Send in small batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const promises = batch.map(user => 
        this.sendSMS(user.phone_number, message)
          .then(success => {
            if (success) sent++;
            else failed++;
            return success;
          })
          .catch(() => {
            failed++;
            return false;
          })
      );
      
      await Promise.allSettled(promises);
      
      // Small delay between batches
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return { sent, failed };
  }
}
