import { MapPin, Calendar, Clock, User, Map as MapIcon, Flag, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import ReportsMap from "./ReportsMap";

interface RaidReport {
  id: number;
  user_id: string;
  location: string;
  latitude: number;
  longitude: number;
  county: string | null;
  state: string | null;
  date: string;
  time: string;
  description: string | null;
  image_keys: string | null;
  validation_status: string | null;
  validation_reason: string | null;
  report_count: number;
  created_at: string;
}

interface ReportFeedProps {
  reports: RaidReport[];
}

export default function ReportFeed({ reports }: ReportFeedProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [reportMessage, setReportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReportPost = async (postId: number) => {
    try {
      const response = await fetch(`/api/raid-reports/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'misinformation' }),
      });

      if (response.status === 409) {
        setReportMessage({ type: 'error', text: t('feed.report_already') });
      } else if (!response.ok) {
        setReportMessage({ type: 'error', text: t('feed.report_error') });
      } else {
        setReportMessage({ type: 'success', text: t('feed.report_success') });
        // Refresh reports after a delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setReportMessage({ type: 'error', text: t('feed.report_error') });
    } finally {
      setReportingPostId(null);
      setTimeout(() => setReportMessage(null), 5000);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
          <MapPin className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t("feed.no_reports")}</h3>
        <p className="text-gray-300">{t("feed.no_reports")}</p>
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

  // Filter reports with valid coordinates for map view
  const reportsWithCoords = reports.filter(r => r.latitude && r.longitude);

  return (
    <div className="space-y-6">
      {reportMessage && (
        <div className={`p-4 rounded-lg border ${
          reportMessage.type === 'success' 
            ? 'bg-green-500/20 border-green-500/50 text-green-200'
            : 'bg-red-500/20 border-red-500/50 text-red-200'
        }`}>
          {reportMessage.text}
        </div>
      )}
      
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setViewMode("list")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            viewMode === "list"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-zinc-900 text-gray-300 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          {t("feed.list_view")}
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            viewMode === "map"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-zinc-900 text-gray-300 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          {t("feed.map_view")}
        </button>
      </div>

      {viewMode === "map" ? (
        reportsWithCoords.length > 0 ? (
          <ReportsMap reports={reportsWithCoords} />
        ) : (
          <div className="text-center py-12 bg-zinc-900/50 backdrop-blur-lg rounded-xl border border-zinc-800">
            <MapIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">No reports with location data yet</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
        <div
          key={report.id}
          className="bg-zinc-900/50 backdrop-blur-lg rounded-xl p-6 border border-zinc-800 hover:bg-zinc-900/70 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{t("feed.anonymous_user")}</p>
              </div>
            </div>
            
            <button
              onClick={() => setReportingPostId(report.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-900 hover:bg-zinc-800 text-gray-300 rounded-lg transition-all border border-zinc-800"
            >
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline">{t("feed.report_post")}</span>
            </button>
          </div>

          {report.validation_status && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              report.validation_status === 'verified' 
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-yellow-500/20 border border-yellow-500/50'
            }`}>
              {report.validation_status === 'verified' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-200 font-medium">{t("feed.verified")}</p>
                    {report.validation_reason && (
                      <p className="text-green-300 text-sm">{report.validation_reason}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-yellow-200 font-medium">{t("feed.flagged")}</p>
                    {report.validation_reason && (
                      <p className="text-yellow-300 text-sm">{report.validation_reason}</p>
                    )}
                    <p className="text-yellow-300 text-xs mt-1">
                      {report.report_count} {t("feed.reports")}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm font-medium">{t("feed.location")}</p>
                <p className="text-white text-lg">{report.location}</p>
                {(report.county || report.state) && (
                  <p className="text-gray-400 text-sm mt-1">
                    {[report.county, report.state].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">{t("form.date")}</p>
                  <p className="text-white">{formatDate(report.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">{t("form.time")}</p>
                  <p className="text-white">{formatTime(report.time)}</p>
                </div>
              </div>
            </div>

            {report.description && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-gray-300 text-sm font-medium mb-1">
                  {t("feed.description")}
                </p>
                <p className="text-white/90">{report.description}</p>
              </div>
            )}

            {report.image_keys && (() => {
              try {
                const imageKeys = JSON.parse(report.image_keys) as string[];
                if (imageKeys.length > 0) {
                  return (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-gray-300 text-sm font-medium mb-3">
                        {t("feed.images")}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imageKeys.map((key, index) => (
                          <img
                            key={index}
                            src={`/api/images/${key}`}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-zinc-800 hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(`/api/images/${key}`, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              } catch (e) {
                return null;
              }
              return null;
            })()}
          </div>
        </div>
          ))}
        </div>
      )}

      {reportingPostId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-2">{t("feed.report_confirm")}</h3>
            <p className="text-gray-300 mb-6">{t("feed.report_confirm_desc")}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setReportingPostId(null)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
              >
                {t("dashboard.cancel")}
              </button>
              <button
                onClick={() => handleReportPost(reportingPostId)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium"
              >
                {t("feed.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
