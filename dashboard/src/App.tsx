import LoginPage from "@/pages/login.tsx";
import {Routes, Route, Navigate, Outlet} from "react-router";
import DashboardPage from "@/pages/dashboard.tsx";
import BeersPage from "@/pages/beers.tsx";
import RegisterPage from "@/pages/register.tsx";
import {useAuth} from "@/contexts/auth-context.tsx";

function ProtectedRoute() {
    const {authenticated} = useAuth();
    return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}



function App() {
  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />} >
                <Route path="/dashboard" element={<DashboardPage />}>
                    <Route path="beers" element={<BeersPage />} />
                </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}

export default App