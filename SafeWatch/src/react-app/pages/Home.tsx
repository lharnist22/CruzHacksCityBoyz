import { useAuth } from "@getmocha/users-service/react";
import { Shield, MapPin, Clock, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ReportForm from "@/react-app/components/ReportForm";
import ReportFeed from "@/react-app/components/ReportFeed";

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

export default function HomePage() {
  const { user, isPending, redirectToLogin, logout } = useAuth();
  const [reports, setReports] = useState<RaidReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/raid-reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const handleReportSuccess = () => {
    setShowForm(false);
    fetchReports();
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Shield className="w-20 h-20 mx-auto text-purple-400 mb-4" />
              <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                SafeWatch
              </h1>
              <p className="text-xl text-purple-200 mb-8">
                Community-driven ICE raid tracking and alerts
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Stay Informed. Stay Safe.
              </h2>
              <p className="text-purple-100 mb-6">
                Join our community to report and track ICE raid locations in real-time. 
                Help keep your community informed and protected.
              </p>
              <button
                onClick={redirectToLogin}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Sign in with Google
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <MapPin className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Track Locations
                </h3>
                <p className="text-purple-200 text-sm">
                  Report exact locations of ICE activity
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Clock className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Real-Time Updates
                </h3>
                <p className="text-purple-200 text-sm">
                  Get instant notifications of new reports
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Calendar className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Date & Time Tracking
                </h3>
                <p className="text-purple-200 text-sm">
                  View historical data and patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">SafeWatch</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-purple-200 hidden sm:inline">{user.email}</span>
            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-100 text-sm">
                  <strong>Stay Safe:</strong> Only report verified information. This platform is for community awareness and safety.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Raid Reports</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {showForm ? "Cancel" : "Report Incident"}
              </button>
            </div>

            {showForm && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Submit New Report
                </h3>
                <ReportForm onSuccess={handleReportSuccess} />
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-4 text-purple-200">Loading reports...</p>
              </div>
            ) : (
              <ReportFeed reports={reports} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
