
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import HealthDataEntry from "./pages/HealthDataEntry";
import PatientRecords from "./pages/PatientRecords";
import MedicationTracker from "./components/MedicationTracker";
import AppointmentScheduler from "./components/AppointmentScheduler";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health-data" 
              element={
                <ProtectedRoute>
                  <HealthDataEntry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient-records" 
              element={
                <ProtectedRoute>
                  <PatientRecords />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/medications" 
              element={
                <ProtectedRoute>
                  <MedicationTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <AppointmentScheduler />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
