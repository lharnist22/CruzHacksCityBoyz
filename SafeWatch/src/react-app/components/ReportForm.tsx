import { useState } from "react";
import { Calendar, Clock, FileText } from "lucide-react";
import MapPicker from "./MapPicker";

interface ReportFormProps {
  onSuccess: () => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocation(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!latitude || !longitude) {
      setError("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/raid-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          latitude,
          longitude,
          date,
          time,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setLocation("");
      setLatitude(undefined);
      setLongitude(undefined);
      setDate("");
      setTime("");
      setDescription("");
      onSuccess();
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-purple-200 mb-2 block">
          Location
        </label>
        <MapPicker
          onLocationSelect={handleLocationSelect}
          selectedLat={latitude}
          selectedLng={longitude}
        />
        {location && (
          <p className="mt-2 text-sm text-white bg-white/10 px-3 py-2 rounded-lg">
            {location}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
            <Clock className="w-4 h-4" />
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
          <FileText className="w-4 h-4" />
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional details about the incident..."
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
