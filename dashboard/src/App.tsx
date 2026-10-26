import LoginPage from "@/pages/login.tsx";
import {Routes, Route, Navigate} from "react-router";
import DashboardPage from "@/pages/dashboard.tsx";

function App() {
  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}

export default App