import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import ChatHistory from './pages/ChatHistory';
import ChatView from './pages/ChatView';
import UploadImage from './pages/UploadImage';
import ProfilePage from './pages/ProfilePage';
import { useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function RouteHandler() {
  const location = useLocation();

  useEffect(() => {
    // Redirect preview_page_v2.html to root
    if (location.pathname === '/preview_page_v2.html') {
      window.history.replaceState({}, '', '/');
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat-history"
        element={
          <ProtectedRoute>
            <ChatHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ChatView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadImage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <RouteHandler />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}