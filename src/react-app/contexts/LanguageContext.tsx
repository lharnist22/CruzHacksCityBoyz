import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Navigation
    "nav.signout": "Cerrar sesión",
    
    // Landing page
    "landing.title": "SafeWatch",
    "landing.subtitle": "Seguimiento y alertas de redadas de ICE impulsado por la comunidad",
    "landing.stay_informed": "Mantente informado. Mantente seguro.",
    "landing.description": "Ayuda a mantener a la comunidad informada y protegida.",
    "landing.signin": "Iniciar sesión con Google",
    "landing.track_locations": "Rastrear ubicaciones",
    "landing.track_desc": "Reportar ubicaciones exactas de actividad de ICE",
    "landing.realtime": "Actualizaciones en tiempo real",
    "landing.realtime_desc": "Recibe notificaciones de nuevos reportes",
    "landing.datetime": "Seguimiento de fecha y hora",
    "landing.datetime_desc": "Ver datos históricos y patrones",
    
    // Dashboard
    "dashboard.stay_safe": "Mantente seguro:",
    "dashboard.stay_safe_desc": "Solo reporta información verificada. Esta plataforma es para la conciencia y seguridad de la comunidad.",
    "dashboard.detention_facilities": "Centros de detención de ICE",
    "dashboard.detention_facilities_desc": "Encuentra información de contacto para centros de detención",
    "dashboard.reports_title": "Reportes de redadas",
    "dashboard.report_incident": "Reportar",
    "dashboard.cancel": "Cancelar",
    "dashboard.submit_new": "Enviar nuevo reporte",
    "dashboard.filter_state": "Filtrar por estado",
    "dashboard.filter_county": "Filtrar por condado",
    "dashboard.all_states": "Estados",
    "dashboard.all_counties": "Condados",
    "dashboard.sort_by": "Ordenar por",
    "dashboard.sort_newest": "Recentemente",
    "dashboard.sort_oldest": "Antiguos",
    "dashboard.loading": "Esperando reportes...",
    "dashboard.no_reports": "No hay reportes disponibles",
    
    // Report form
    "form.location": "Ubicación",
    "form.date": "Fecha",
    "form.time": "Hora",
    "form.description": "Descripción (opcional)",
    "form.description_placeholder": "Detalles adicionales",
    "form.images": "Imágenes (opcional)",
    "form.images_warning": "HEIC, JPEG y PNG",
    "form.error_location": "Selecciona una ubicación",
    "form.error_submit": "Error. Intenta de nuevo.",
    "form.submitting": "Enviando...",
    "form.submit": "Enviar reporte",
    "form.file_rejected": "Error. Formatos HEIC, JPEG y PNG.",
    
    // Report feed
    "feed.anonymous_user": "Usuario anónimo",
    "feed.list_view": "Vista de lista",
    "feed.map_view": "Vista de mapa",
    "feed.location": "Ubicación",
    "feed.date_time": "Fecha y hora",
    "feed.description": "Descripción",
    "feed.images": "Imágenes",
    "feed.no_reports": "Sé primero en reportar.",
    "feed.report_post": "Reportar desinformación",
    "feed.report_success": "Reporte enviado. Gracias por ayudar a mantener la precisión.",
    "feed.report_already": "Ya reportaste este post",
    "feed.report_error": "Error al reportar. Intenta de nuevo.",
    "feed.report_confirm": "¿Reportar este post por desinformación?",
    "feed.report_confirm_desc": "Si suficientes usuarios reportan este post, será revisado por IA para validar su precisión.",
    "feed.confirm": "Confirmar reporte",
    "feed.verified": "Verificado",
    "feed.flagged": "Señalado como posible desinformación",
    "feed.reports": "reportes",
    
    // News page
    "news.title": "Noticias",
    "news.back_to_reports": "Volver a reportes",
    "news.local_news_desc": "Noticias locales de {city}, {state}",
    "news.default_trusted_sources_desc": "Noticias de fuentes confiables sobre inmigración y derechos civiles",
    "news.location_denied": "Ubicación denegada",
    "news.location_denied_desc": "Mostrando noticias generales. Habilita la ubicación para ver noticias locales.",
    "news.error_fetch": "Error al cargar noticias. Intenta de nuevo.",
    "news.loading": "Cargando noticias...",
    "news.no_articles": "No hay artículos disponibles en este momento",
  },
  en: {
    // Navigation
    "nav.signout": "Sign out",
    
    // Landing page
    "landing.title": "SafeWatch",
    "landing.subtitle": "Community-driven ICE raid tracking and alerts",
    "landing.stay_informed": "Stay Informed. Stay Safe.",
    "landing.description": "Join our community to report and track ICE raid locations in real-time. Help keep your community informed and protected.",
    "landing.signin": "Sign in with Google",
    "landing.track_locations": "Track Locations",
    "landing.track_desc": "Report exact locations of ICE activity",
    "landing.realtime": "Real-Time Updates",
    "landing.realtime_desc": "Get instant notifications of new reports",
    "landing.datetime": "Date & Time Tracking",
    "landing.datetime_desc": "View historical data and patterns",
    
    // Dashboard
    "dashboard.stay_safe": "Stay Safe:",
    "dashboard.stay_safe_desc": "Only report verified information. This platform is for community awareness and safety.",
    "dashboard.detention_facilities": "ICE Detention Facilities",
    "dashboard.detention_facilities_desc": "Find contact information for detention centers",
    "dashboard.reports_title": "Raid Reports",
    "dashboard.report_incident": "Report Incident",
    "dashboard.cancel": "Cancel",
    "dashboard.submit_new": "Submit New Report",
    "dashboard.filter_state": "Filter by State",
    "dashboard.filter_county": "Filter by County",
    "dashboard.all_states": "All States",
    "dashboard.all_counties": "All Counties",
    "dashboard.sort_by": "Sort by",
    "dashboard.sort_newest": "Most Recent",
    "dashboard.sort_oldest": "Oldest First",
    "dashboard.loading": "Loading reports...",
    "dashboard.no_reports": "No reports available",
    
    // Report form
    "form.location": "Location",
    "form.date": "Date",
    "form.time": "Time",
    "form.description": "Description (optional)",
    "form.description_placeholder": "Additional details about the incident...",
    "form.images": "Images (optional)",
    "form.images_warning": "Only HEIC, JPEG, and PNG file formats are supported",
    "form.error_location": "Please select a location on the map",
    "form.error_submit": "Failed to submit report. Please try again.",
    "form.submitting": "Submitting...",
    "form.submit": "Submit Report",
    "form.file_rejected": "Some files were rejected. Only HEIC, JPEG, and PNG formats are supported.",
    
    // Report feed
    "feed.anonymous_user": "Anonymous User",
    "feed.list_view": "List View",
    "feed.map_view": "Map View",
    "feed.location": "Location",
    "feed.date_time": "Date & Time",
    "feed.description": "Description",
    "feed.images": "Images",
    "feed.no_reports": "No reports yet. Be the first to report an incident.",
    "feed.report_post": "Report Misinformation",
    "feed.report_success": "Report submitted. Thank you for helping keep information accurate.",
    "feed.report_already": "You have already reported this post",
    "feed.report_error": "Failed to submit report. Please try again.",
    "feed.report_confirm": "Report this post for misinformation?",
    "feed.report_confirm_desc": "If enough users report this post, it will be reviewed by AI to validate its accuracy.",
    "feed.confirm": "Confirm Report",
    "feed.verified": "Verified",
    "feed.flagged": "Flagged as potential misinformation",
    "feed.reports": "reports",
    
    // News page
    "news.title": "News",
    "news.back_to_reports": "Back to Reports",
    "news.local_news_desc": "Local news from {city}, {state}",
    "news.default_trusted_sources_desc": "News from trusted sources about immigration and civil rights",
    "news.location_denied": "Location access denied",
    "news.location_denied_desc": "Showing general news. Enable location to see local news.",
    "news.error_fetch": "Failed to load news. Please try again.",
    "news.loading": "Loading news...",
    "news.no_articles": "No articles available at this time",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "en" || saved === "es") ? saved : "es";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key as keyof typeof translations.es] || key;
    
    // Replace parameters in translation strings like {city}, {state}
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, value);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
