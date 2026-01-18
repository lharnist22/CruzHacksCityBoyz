// src/worker/services/NotificationService.ts
import { TwilioService } from './TwilioService';

export interface NotificationUser {
  id: number;
  user_id: string;
  phone_number: string;
  notification_state: string | null;
  notification_county: string | null;
  receive_sms_notifications: boolean;
}

export class NotificationService {
  private twilioService: TwilioService;

  constructor(private env: Env) {
    this.twilioService = new TwilioService(env);
  }

  private formatAlertMessage(report: any, language: 'en' | 'es' = 'en'): string {
    try {
      const date = new Date(report.date + 'T' + report.time);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      const timeParts = report.time.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const formattedTime = `${displayHours}:${minutes} ${ampm}`;
      
      if (language === 'es') {
        return `🚨 ALERTA SAFEWATCH 🚨
Nuevo reporte de redada:
📍 ${report.location}
🗓️ ${formattedDate} - ${formattedTime}
${report.county ? `🏙️ ${report.county}, ${report.state}` : report.state ? `🏙️ ${report.state}` : ''}
${report.description ? `📝 ${report.description.substring(0, 50)}${report.description.length > 50 ? '...' : ''}` : ''}

Más detalles: https://getmocha.com
Para desuscribirse: responder STOP`;
      } else {
        return `🚨 SAFEWATCH ALERT 🚨
New raid report:
📍 ${report.location}
🗓️ ${formattedDate} - ${formattedTime}
${report.county ? `🏙️ ${report.county}, ${report.state}` : report.state ? `🏙️ ${report.state}` : ''}
${report.description ? `📝 ${report.description.substring(0, 50)}${report.description.length > 50 ? '...' : ''}` : ''}

More details: https://getmocha.com
To unsubscribe: reply STOP`;
      }
    } catch (error) {
      // Fallback simple message
      return `🚨 SAFEWATCH ALERT 🚨
New raid report at ${report.location}
Date: ${report.date} Time: ${report.time}
${report.state ? `State: ${report.state}` : ''}
${report.county ? `County: ${report.county}` : ''}

More details: https://getmocha.com
To unsubscribe: reply STOP`;
    }
  }

  async getUsersToNotify(reportState: string, reportCounty: string | null): Promise<NotificationUser[]> {
    try {
      let query = `
        SELECT * FROM user_notification_preferences 
        WHERE receive_sms_notifications = 1 
        AND phone_number IS NOT NULL
        AND phone_number != ''
        AND (notification_state IS NULL OR notification_state = ? OR notification_state = '')
      `;
      
      const params: any[] = [reportState || ''];
      
      if (reportCounty) {
        query += ` AND (notification_county IS NULL OR notification_county = ? OR notification_county = '')`;
        params.push(reportCounty);
      }
      
      const { results } = await this.env.DB.prepare(query).bind(...params).all();
      return results as unknown as NotificationUser[];
    } catch (error) {
      console.error('Error fetching users to notify:', error);
      return [];
    }
  }

  async sendBulkNotifications(report: any): Promise<{ sent: number; failed: number }> {
    // If no state is specified, skip notifications
    if (!report.state) {
      console.log('⚠️ No state specified for report, skipping notifications');
      return { sent: 0, failed: 0 };
    }

    // Get users who want notifications for this state/county
    const users = await this.getUsersToNotify(report.state, report.county);
    
    if (users.length === 0) {
      console.log(`ℹ️ No users to notify for ${report.state}${report.county ? `, ${report.county}` : ''}`);
      return { sent: 0, failed: 0 };
    }

    const message = this.formatAlertMessage(report, 'en');
    console.log(`📢 Sending notifications to ${users.length} users for report in ${report.state}`);
    
    // Send notifications via Twilio
    const result = await this.twilioService.sendBulkSMS(users, message);
    console.log(`📊 Notification results: ${result.sent} sent, ${result.failed} failed`);
    
    return result;
  }
}
