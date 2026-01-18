import { useEffect, useRef, useState } from "react";
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

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string, county?: string, state?: string) => void;
  selectedLat?: number;
  selectedLng?: number;
}

export default function MapPicker({
  onLocationSelect,
  selectedLat,
  selectedLng,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on LA
    const map = L.map(mapRef.current).setView([34.0522, -118.2437], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add marker on click
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const county = data.address?.county || data.address?.city || undefined;
        const state = data.address?.state || undefined;
        onLocationSelect(lat, lng, address, county, state);
      } catch (error) {
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });

    // If there's an initial position, set marker
    if (selectedLat && selectedLng) {
      markerRef.current = L.marker([selectedLat, selectedLng]).addTo(map);
      map.setView([selectedLat, selectedLng], 13);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 13);
            
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
            }

            // Reverse geocode
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await response.json();
              const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
              const county = data.address?.county || data.address?.city || undefined;
              const state = data.address?.state || undefined;
              onLocationSelect(lat, lng, address, county, state);
            } catch (error) {
              onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-purple-200">Click on the map to set location</p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="text-sm text-purple-400 hover:text-purple-300 underline disabled:opacity-50"
        >
          {isLocating ? "Locating..." : "Use my location"}
        </button>
      </div>
      <div
        ref={mapRef}
        className="w-full h-64 rounded-lg border border-white/20 overflow-hidden"
      />
    </div>
  );
}
