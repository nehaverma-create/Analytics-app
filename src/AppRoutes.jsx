import { Routes, Route } from "react-router-dom";
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
      <Route path="/analytics/:name" element={         
         <ProtectedRoute>
<Analytics />
 </ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;