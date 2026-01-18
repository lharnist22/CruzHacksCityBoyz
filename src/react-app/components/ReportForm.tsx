import { useState } from "react";
import { Calendar, Clock, FileText, Upload, X, AlertCircle } from "lucide-react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import MapPicker from "./MapPicker";

interface ReportFormProps {
  onSuccess: () => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [county, setCounty] = useState<string | undefined>();
  const [state, setState] = useState<string | undefined>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileTypeWarning, setFileTypeWarning] = useState(false);

  const handleLocationSelect = (lat: number, lng: number, address: string, county?: string, state?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocation(address);
    setCounty(county);
    setState(state);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ['image/heic', 'image/jpeg', 'image/png'];
    const allowedExtensions = ['.heic', '.jpeg', '.jpg', '.png'];
    
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return allowedTypes.includes(file.type.toLowerCase()) || allowedExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      setFileTypeWarning(true);
      setTimeout(() => setFileTypeWarning(false), 5000);
    }

    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!latitude || !longitude) {
      setError(t("form.error_location"));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("location", location);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      if (county) formData.append("county", county);
      if (state) formData.append("state", state);
      formData.append("date", date);
      formData.append("time", time);
      if (description) formData.append("description", description);
      
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/raid-reports", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setLocation("");
      setLatitude(undefined);
      setLongitude(undefined);
      setCounty(undefined);
      setState(undefined);
      setDate("");
      setTime("");
      setDescription("");
      setImages([]);
      onSuccess();
    } catch (err) {
      setError(t("form.error_submit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-purple-200 mb-2 block">
          {t("form.location")}
        </label>
        <MapPicker
          onLocationSelect={handleLocationSelect}
          selectedLat={latitude}
          selectedLng={longitude}
        />
        {location && (
          <p className="mt-2 text-sm text-white bg-white/10 px-3 py-2 rounded-lg">
            {location}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
            <Calendar className="w-4 h-4" />
            {t("form.date")}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
            <Clock className="w-4 h-4" />
            {t("form.time")}
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
          <FileText className="w-4 h-4" />
          {t("form.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("form.description_placeholder")}
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
          <Upload className="w-4 h-4" />
          {t("form.images")}
        </label>
        <div className="space-y-3">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm">
              {t("form.images_warning")}
            </p>
          </div>
          
          <input
            type="file"
            accept=".heic,.jpeg,.jpg,.png,image/heic,image/jpeg,image/png"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:cursor-pointer hover:file:bg-purple-600 transition-all"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-purple-200 mt-1 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {fileTypeWarning && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {t("form.file_rejected")}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
      >
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}
