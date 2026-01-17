import { useAuth } from "@getmocha/users-service/react";
import { MapPin, Clock, Calendar, AlertCircle, Building2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import ReportForm from "@/react-app/components/ReportForm";
import ReportFeed from "@/react-app/components/ReportFeed";
import MeltingIceCube from "@/react-app/components/MeltingIceCube";
import NotificationSettings from "@/react-app/components/NotificationSettings";

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

export default function HomePage() {
  const { user, isPending, redirectToLogin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [reports, setReports] = useState<RaidReport[]>([]);
  const [allReports, setAllReports] = useState<RaidReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/raid-reports");
      if (response.ok) {
        const data = await response.json();
        setAllReports(data);
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

  useEffect(() => {
    let filtered = allReports;
    
    if (selectedState) {
      filtered = filtered.filter(r => r.state === selectedState);
    }
    
    if (selectedCounty) {
      filtered = filtered.filter(r => r.county === selectedCounty);
    }
    
    // Sort the filtered reports
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setReports(sorted);
  }, [selectedState, selectedCounty, sortOrder, allReports]);

  const handleReportSuccess = () => {
    setShowForm(false);
    fetchReports();
  };

  const uniqueStates = Array.from(new Set(allReports.map(r => r.state).filter((s): s is string => Boolean(s)))).sort();
  const uniqueCounties = Array.from(new Set(
    allReports
      .filter(r => !selectedState || r.state === selectedState)
      .map(r => r.county)
      .filter((c): c is string => Boolean(c))
  )).sort();

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
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                {language === "es" ? "EN" : "ES"}
              </button>
            </div>

            <div className="mb-8">
              <div className="mx-auto mb-4 flex justify-center">
                <MeltingIceCube className="w-20 h-20" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {t("landing.title")}
              </h1>
              <p className="text-xl text-purple-200 mb-8">
                {t("landing.subtitle")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {t("landing.stay_informed")}
              </h2>
              <p className="text-purple-100 mb-6">
                {t("landing.description")}
              </p>
              <button
                onClick={redirectToLogin}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                {t("landing.signin")}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <MapPin className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("landing.track_locations")}
                </h3>
                <p className="text-purple-200 text-sm">
                  {t("landing.track_desc")}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Clock className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("landing.realtime")}
                </h3>
                <p className="text-purple-200 text-sm">
                  {t("landing.realtime_desc")}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Calendar className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("landing.datetime")}
                </h3>
                <p className="text-purple-200 text-sm">
                  {t("landing.datetime_desc")}
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
            <MeltingIceCube className="w-8 h-8" />
            <span className="text-xl font-bold text-white">{t("landing.title")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-purple-200 hidden sm:inline">{user.email}</span>
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("nav.signout")}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-100 text-sm">
                    <strong>{t("dashboard.stay_safe")}</strong> {t("dashboard.stay_safe_desc")}
                  </p>
                </div>
              </div>

              <a
                href="https://www.ice.gov/detention-facilities"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 flex items-start gap-3 hover:bg-blue-500/30 transition-all group"
              >
                <Building2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-100 text-sm">
                    <strong className="flex items-center gap-2">
                      {t("dashboard.detention_facilities")}
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </strong>
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    {t("dashboard.detention_facilities_desc")}
                  </p>
                </div>
              </a>
            </div>
            
            <div className="mt-8 mb-8">
              <NotificationSettings />
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{t("dashboard.reports_title")}</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {showForm ? t("dashboard.cancel") : t("dashboard.report_incident")}
              </button>
            </div>

            {showForm && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t("dashboard.submit_new")}
                </h3>
                <ReportForm onSuccess={handleReportSuccess} />
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            {!isLoading && allReports.length > 0 && (
              <div className="mb-6 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {t("dashboard.filter_state")}
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCounty("");
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-slate-800">{t("dashboard.all_states")}</option>
                    {uniqueStates.map(state => (
                      <option key={state} value={state} className="bg-slate-800">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {t("dashboard.filter_county")}
                  </label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={!selectedState && uniqueCounties.length === 0}
                  >
                    <option value="" className="bg-slate-800">{t("dashboard.all_counties")}</option>
                    {uniqueCounties.map(county => (
                      <option key={county} value={county} className="bg-slate-800">
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {t("dashboard.sort_by")}
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="newest" className="bg-slate-800">{t("dashboard.sort_newest")}</option>
                    <option value="oldest" className="bg-slate-800">{t("dashboard.sort_oldest")}</option>
                  </select>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-4 text-purple-200">{t("dashboard.loading")}</p>
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
