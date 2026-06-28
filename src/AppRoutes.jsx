import { Routes, Route, Navigate } from "react-router-dom";
import ManageWebsites from "./pages/ManageWebsite";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/analytics";
import"./styles.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-websites"
        element={
          <ProtectedRoute>
            <ManageWebsites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:id"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;