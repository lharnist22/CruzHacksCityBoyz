import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface RaidReport {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  description: string | null;
}

interface ReportsMapProps {
  reports: RaidReport[];
}

export default function ReportsMap({ reports }: ReportsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize map centered on LA
    const map = L.map(mapRef.current).setView([34.0522, -118.2437], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for all reports with valid coordinates
    const markers: L.Marker[] = [];
    reports.forEach((report) => {
      if (report.latitude && report.longitude) {
        const marker = L.marker([report.latitude, report.longitude]).addTo(map);
        
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

        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${report.location}</h3>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formatDate(report.date)}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(report.time)}</p>
            ${report.description ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #ddd;">${report.description}</p>` : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
      }
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [reports]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-xl border border-white/20 overflow-hidden shadow-2xl"
    />
  );
}
