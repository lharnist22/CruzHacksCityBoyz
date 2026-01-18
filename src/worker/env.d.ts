// Augment the Env interface with Twilio credentials and News API
declare global {
  interface Env {
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_PHONE_NUMBER: string;
    NEWS_API_KEY: string;
  }
}

export {};
