import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./components/LandingPage"; // <-- NEW: Import LandingPage
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/DashboardPage";
import FavoritesPage from "./components/FavoritesPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

// --- (PrivateRoute and PublicRoute are unchanged) ---
// PrivateRoute: If you're logged in, show the page. If not, go to /login.
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// PublicRoute: If you're logged out, show the page. If logged in, go to /dashboard.
function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- UPDATED: / is now the public landing page --- */}
        <Route path="/" element={<LandingPage />} />

        {/* --- NEW: /login is the new public route for logging in --- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* --- (Reset password route is unchanged) --- */}
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* --- (Dashboard and Favorites routes are unchanged) --- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
