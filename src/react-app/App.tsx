import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import NewsPage from "@/react-app/pages/News";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
