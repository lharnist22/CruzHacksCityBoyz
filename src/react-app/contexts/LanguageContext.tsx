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
    "nav.news": "Noticias",
    
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
    "news.local_news_desc": "Noticias locales sobre redadas y arrestos de ICE en {city}, {state}",
    "news.general_news_desc": "Noticias generales sobre redadas y arrestos de ICE en Estados Unidos",
    "news.default_trusted_sources_desc": "Noticias destacadas sobre ICE de New York Times, Washington Post, USA Today y Human Rights Watch",
    "news.location_denied": "Permiso de ubicación denegado:",
    "news.location_denied_desc": "Mostrando noticias generales sobre ICE en Estados Unidos. Para ver noticias locales, permite el acceso a tu ubicación.",
    "news.loading": "Cargando noticias...",
    "news.error_fetch": "Error al cargar noticias. Por favor, intenta de nuevo más tarde.",
    "news.no_articles": "No se encontraron artículos en este momento.",
    "news.back_to_reports": "Volver a reportes",
    
    // SMS notifications
    "sms.title": "Notificaciones por SMS",
    "sms.description": "Prueba nuestro servicios.",
    "sms.phone_placeholder": "+1234567890",
    "sms.send_test": "Envia",
    "sms.sending": "Enviando...",
    "sms.success_message": "¡Mensaje enviado exitosamente! Revisa tu teléfono.",
    "sms.error_phone_required": "Por favor, ingresa un número de teléfono.",
    "sms.error_send": "Error al enviar el mensaje. Por favor, verifica el número e intenta de nuevo.",
    "sms.format_hint": "Formato: +[código de país][número] (ejemplo: +1234567890)",
  },
  en: {
    // Navigation
    "nav.signout": "Sign out",
    "nav.news": "News",
    
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
    "news.local_news_desc": "Local news about ICE raids and arrests in {city}, {state}",
    "news.general_news_desc": "General news about ICE raids and arrests in the United States",
    "news.default_trusted_sources_desc": "Top ICE articles from New York Times, Washington Post, USA Today, and Human Rights Watch",
    "news.location_denied": "Location permission denied:",
    "news.location_denied_desc": "Showing general ICE news in the United States. To see local news, please allow location access.",
    "news.loading": "Loading news...",
    "news.error_fetch": "Failed to load news. Please try again later.",
    "news.no_articles": "No articles found at this time.",
    "news.back_to_reports": "Back to Reports",
    
    // SMS notifications
    "sms.title": "SMS Notifications",
    "sms.description": "Test our SMS notification service. Send a test message to your phone number.",
    "sms.phone_placeholder": "+1234567890",
    "sms.send_test": "Send Test Message",
    "sms.sending": "Sending...",
    "sms.success_message": "Message sent successfully! Check your phone.",
    "sms.error_phone_required": "Please enter a phone number.",
    "sms.error_send": "Failed to send message. Please verify the number and try again.",
    "sms.format_hint": "Format: +[country code][number] (e.g., +1234567890)",
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
    let text = translations[language][key as keyof typeof translations.es] || key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    return text;
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
