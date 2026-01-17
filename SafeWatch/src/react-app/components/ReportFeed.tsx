import { MapPin, Calendar, Clock, User, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import ReportsMap from "./ReportsMap";

interface RaidReport {
  id: number;
  user_id: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  description: string | null;
  created_at: string;
}

interface ReportFeedProps {
  reports: RaidReport[];
}

export default function ReportFeed({ reports }: ReportFeedProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
          <MapPin className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No reports yet</h3>
        <p className="text-purple-200">Be the first to submit a raid report.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Filter reports with valid coordinates for map view
  const reportsWithCoords = reports.filter(r => r.latitude && r.longitude);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setViewMode("list")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            viewMode === "list"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "bg-white/10 text-purple-200 hover:bg-white/20"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            viewMode === "map"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "bg-white/10 text-purple-200 hover:bg-white/20"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Map View
        </button>
      </div>

      {viewMode === "map" ? (
        reportsWithCoords.length > 0 ? (
          <ReportsMap reports={reportsWithCoords} />
        ) : (
          <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <MapIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200">No reports with location data yet</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/[0.15] transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Anonymous User</p>
                <p className="text-purple-300 text-sm">
                  {formatRelativeTime(report.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-200 text-sm font-medium">Location</p>
                <p className="text-white text-lg">{report.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 text-sm font-medium">Date</p>
                  <p className="text-white">{formatDate(report.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 text-sm font-medium">Time</p>
                  <p className="text-white">{formatTime(report.time)}</p>
                </div>
              </div>
            </div>

            {report.description && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-purple-200 text-sm font-medium mb-1">
                  Description
                </p>
                <p className="text-white/90">{report.description}</p>
              </div>
            )}
          </div>
        </div>
          ))}
        </div>
      )}
    </div>
  );
}
