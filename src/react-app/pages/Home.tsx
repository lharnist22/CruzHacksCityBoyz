<<<<<<< HEAD
import { useAuth } from "@getmocha/users-service/react";
import { AlertCircle, Building2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import ReportForm from "@/react-app/components/ReportForm";
import ReportFeed from "@/react-app/components/ReportFeed";
import MeltingIceCube from "@/react-app/components/MeltingIceCube";

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
  const { isPending } = useAuth();
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
    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = allReports;

    if (selectedState) {
      filtered = filtered.filter((r) => r.state === selectedState);
    }

    if (selectedCounty) {
      filtered = filtered.filter((r) => r.county === selectedCounty);
    }

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

  const uniqueStates = Array.from(
    new Set(allReports.map((r) => r.state).filter((s): s is string => Boolean(s)))
  ).sort();

  const uniqueCounties = Array.from(
    new Set(
      allReports
        .filter((r) => !selectedState || r.state === selectedState)
        .map((r) => r.county)
        .filter((c): c is string => Boolean(c))
    )
  ).sort();

  const pageBg =
    "bg-neutral-950 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_55%)]";

  if (isPending) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MeltingIceCube className="w-8 h-8" />
            <span className="text-xl font-bold text-white">{t("landing.title")}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/news"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {t("nav.news")}
            </a>

            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors font-medium border border-white/10"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
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
                className="bg-blue-500/15 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 hover:bg-blue-500/20 transition-all group"
              >
                <Building2 className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-100 text-sm">
                    <strong className="flex items-center gap-2">
                      {t("dashboard.detention_facilities")}
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </strong>
                  </p>
                  <p className="text-blue-200 text-xs mt-1">{t("dashboard.detention_facilities_desc")}</p>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{t("dashboard.reports_title")}</h2>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/10"
              >
                {showForm ? t("dashboard.cancel") : t("dashboard.report_incident")}
              </button>
            </div>

            {showForm && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">{t("dashboard.submit_new")}</h3>
                <ReportForm onSuccess={handleReportSuccess} />
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            {!isLoading && allReports.length > 0 && (
              <div className="mb-6 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("dashboard.filter_state")}
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCounty("");
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      {t("dashboard.all_states")}
                    </option>
                    {uniqueStates.map((state) => (
                      <option key={state} value={state} className="bg-slate-900">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("dashboard.filter_county")}
                  </label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={!selectedState && uniqueCounties.length === 0}
                  >
                    <option value="" className="bg-slate-900">
                      {t("dashboard.all_counties")}
                    </option>
                    {uniqueCounties.map((county) => (
                      <option key={county} value={county} className="bg-slate-900">
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t("dashboard.sort_by")}</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="newest" className="bg-slate-900">
                      {t("dashboard.sort_newest")}
                    </option>
                    <option value="oldest" className="bg-slate-900">
                      {t("dashboard.sort_oldest")}
                    </option>
                  </select>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
                <p className="mt-4 text-slate-300">{t("dashboard.loading")}</p>
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