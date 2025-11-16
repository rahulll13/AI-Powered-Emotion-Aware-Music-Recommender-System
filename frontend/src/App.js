import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/DashboardPage";
import FavoritesPage from "./components/FavoritesPage"; // <-- NEW: Import FavoritesPage
import ResetPasswordPage from "./components/ResetPasswordPage";

// --- (PrivateRoute and PublicRoute are unchanged) ---
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        {/* --- 2. ADD THIS NEW ROUTE --- */}
        {/* This is a public route for the reset password page */}
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* --- NEW: FAVORITES ROUTE --- */}
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
