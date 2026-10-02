import LoginPage from "@/pages/login.tsx";
import {Routes, Route, Navigate} from "react-router";

function App() {
  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}

export default App