import { useState, useEffect } from "react";
import { Bell, Phone, MapPin, Globe, AlertCircle } from "lucide-react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";

interface NotificationPreferences {
  phone_number: string | null;
  notification_state: string | null;
  notification_county: string | null;
  receive_sms_notifications: boolean;
}

export default function NotificationSettings() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    phone_number: "",
    notification_state: "",
    notification_county: "",
    receive_sms_notifications: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // US States list
  const [states] = useState<string[]>([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/notification-preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences({
          phone_number: data.phone_number || "",
          notification_state: data.notification_state || "",
          notification_county: data.notification_county || "",
          receive_sms_notifications: data.receive_sms_notifications || false
        });
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // Validate phone number if notifications are enabled
    if (preferences.receive_sms_notifications && preferences.phone_number) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(preferences.phone_number)) {
        setMessage({ 
          type: 'error', 
          text: "Invalid phone number format. Use international format: +1234567890" 
        });
        setIsSaving(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: preferences.phone_number || null,
          notification_state: preferences.notification_state || null,
          notification_county: preferences.notification_county || null,
          receive_sms_notifications: preferences.receive_sms_notifications
        })
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: "Notification preferences updated successfully!" 
        });
        setTimeout(() => setMessage(null), 5000);
      } else {
        const error = await response.json();
        setMessage({ 
          type: 'error', 
          text: error.error || "Failed to update preferences" 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: "Network error. Please try again." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="mt-2 text-purple-200">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">SMS Notifications</h3>
          <p className="text-purple-200 text-sm">Get alerts for new raid reports in your area</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/50 text-green-200'
            : 'bg-red-500/20 border-red-500/50 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-sm font-medium mb-1">Important Information</p>
              <ul className="text-yellow-300 text-sm space-y-1">
                <li>• Standard messaging rates may apply</li>
                <li>• You can unsubscribe at any time by replying STOP</li>
                <li>• For help, reply HELP</li>
                <li>• Supported carriers only</li>
                <li>• Phone number must be in international format</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number (International Format)
            </label>
            <input
              type="tel"
              value={preferences.phone_number || ""}
              onChange={(e) => setPreferences(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="+1234567890"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-purple-300 text-xs mt-1">
              Format: + followed by country code and number (e.g., +1234567890)
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <MapPin className="w-4 h-4" />
              Filter by State (Optional)
            </label>
            <select
              value={preferences.notification_state || ""}
              onChange={(e) => {
                setPreferences(prev => ({ 
                  ...prev, 
                  notification_state: e.target.value || null,
                  notification_county: "" // Clear county if state changes
                }));
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="" className="bg-slate-800">All States (Receive all alerts)</option>
              {states.map(state => (
                <option key={state} value={state} className="bg-slate-800">
                  {state}
                </option>
              ))}
            </select>
            <p className="text-purple-300 text-xs mt-1">
              Leave empty to receive alerts for all states
            </p>
          </div>

          {preferences.notification_state && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
                <Globe className="w-4 h-4" />
                Filter by County (Optional)
              </label>
              <input
                type="text"
                value={preferences.notification_county || ""}
                onChange={(e) => setPreferences(prev => ({ ...prev, notification_county: e.target.value || null }))}
                placeholder="e.g., Los Angeles"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-purple-300 text-xs mt-1">
                Leave empty to receive alerts for entire state
              </p>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="receive-notifications"
                checked={preferences.receive_sms_notifications}
                onChange={(e) => setPreferences(prev => ({ ...prev, receive_sms_notifications: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
              />
            </div>
            <label htmlFor="receive-notifications" className="text-white text-sm">
              Enable SMS notifications for new raid reports in my selected area
              <p className="text-purple-300 text-xs mt-1">
                You will receive an SMS whenever a new raid report is submitted in your specified location
              </p>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving || (preferences.receive_sms_notifications && !preferences.phone_number)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? "Saving..." : "Save Notification Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
