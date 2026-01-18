import { useAuth } from "@getmocha/users-service/react";
import { MapPin, ExternalLink, Newspaper, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import MeltingIceCube from "@/react-app/components/MeltingIceCube";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: string;
}

export default function NewsPage() {
  const { isPending } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "checking">("checking");
  const [userLocation, setUserLocation] = useState<{ city?: string; state?: string; lat?: number; lon?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Request location permission and get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      fetchGeneralNews();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationPermission("granted");
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city and state
          const geocodeResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json();
            const location = {
              city: geocodeData.city || geocodeData.locality || "",
              state: geocodeData.principalSubdivision || "",
              lat: latitude,
              lon: longitude,
            };
            setUserLocation(location);
            fetchLocalNews(location);
          } else {
            // If reverse geocoding fails, still try to fetch news with coordinates
            setUserLocation({ lat: latitude, lon: longitude });
            fetchLocalNews({ lat: latitude, lon: longitude });
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setUserLocation({ lat: latitude, lon: longitude });
          fetchLocalNews({ lat: latitude, lon: longitude });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationPermission("denied");
        fetchGeneralNews();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  const fetchLocalNews = async (location: { city?: string; state?: string; lat?: number; lon?: number }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (location.lat) params.append("latitude", location.lat.toString());
      if (location.lon) params.append("longitude", location.lon.toString());
      if (location.city) params.append("city", location.city);
      if (location.state) params.append("state", location.state);

      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        // If local news is empty, it will already fallback to default trusted sources on backend
        setArticles(data.articles);
        // If we got articles from trusted sources, we know local news was empty
        if (data.articles.length > 0 && data.articles.some((a: NewsArticle) => 
          a.source.includes("New York Times") || 
          a.source.includes("Washington Post") || 
          a.source.includes("USA Today") || 
          a.source.includes("Human Rights Watch")
        )) {
          // Local news was empty, showing default trusted sources - no error needed
        }
      } else {
        setError(data.message || t("news.error_fetch"));
      }
    } catch (err) {
      console.error("Failed to fetch local news:", err);
      setError(t("news.error_fetch"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeneralNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/news");
      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        setError(data.message || t("news.error_fetch"));
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(t("news.error_fetch"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

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
              href="/"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {t("news.back_to_reports")}
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Newspaper className="w-10 h-10" />
              {t("news.title")}
            </h1>
            <p className="text-slate-300 text-lg">
              {locationPermission === "granted" && userLocation && userLocation.city && userLocation.state
                ? articles.length > 0 && articles.some((a) => 
                    a.source.includes("New York Times") || 
                    a.source.includes("Washington Post") || 
                    a.source.includes("USA Today") || 
                    a.source.includes("Human Rights Watch")
                  )
                  ? t("news.default_trusted_sources_desc")
                  : t("news.local_news_desc", { city: userLocation.city, state: userLocation.state })
                : t("news.default_trusted_sources_desc")}
            </p>
          </div>

          {locationPermission === "denied" && (
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-100 text-sm">
                  <strong>{t("news.location_denied")}</strong> {t("news.location_denied_desc")}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mb-4" />
              <p className="text-slate-300">{t("news.loading")}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
              <Newspaper className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-300 text-lg">{t("news.no_articles")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  {article.urlToImage && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{article.source}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
