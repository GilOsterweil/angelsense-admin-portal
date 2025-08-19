import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GPSTrackers from "./pages/GPSTrackers";
import Guardians from "./pages/Guardians";
import Angels from "./pages/Angels";
import Hotspots from "./pages/Hotspots";
import Beacons from "./pages/Beacons";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/gps-trackers" element={<GPSTrackers />} />
                    <Route path="/guardians" element={<Guardians />} />
                    <Route path="/angels" element={<Angels />} />
                    <Route path="/hotspots" element={<Hotspots />} />
                    <Route path="/beacons" element={<Beacons />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
