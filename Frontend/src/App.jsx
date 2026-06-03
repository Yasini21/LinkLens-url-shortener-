import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import OverallAnalytics from "./pages/OverallAnalytics";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <OverallAnalytics />
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
    </Routes>
  );
}

export default App;