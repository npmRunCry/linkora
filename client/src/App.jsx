import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout"
import LinksPage from "@/pages/dashboard/LinksPage"
import AppearancePage from "@/pages/dashboard/AppearancePage"
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"
import PhonePreview from "@/components/profile/PhonePreview"
import { ProfileProvider } from "@/context/ProfileContext"
import PublicProfilePage from "./pages/PublicProfilePage";

function DashboardRoute({ children }) {
  return (
    <ProtectedRoute>
      <ProfileProvider>
        <DashboardLayout preview={<PhonePreview />}>
          {children}
        </DashboardLayout>
      </ProfileProvider>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/links" replace />}
        />
        <Route
          path="/dashboard/links"
          element={<DashboardRoute><LinksPage /></DashboardRoute>}
        />
        <Route
          path="/dashboard/appearance"
          element={<DashboardRoute><AppearancePage /></DashboardRoute>}
        />
        <Route
          path="/dashboard/analytics"
          element={<DashboardRoute><AnalyticsPage /></DashboardRoute>}
        />
        <Route
          path="/dashboard/settings"
          element={<DashboardRoute><SettingsPage /></DashboardRoute>}
        />

        <Route path="/:username" element={<PublicProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;