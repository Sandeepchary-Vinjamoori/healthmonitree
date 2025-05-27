
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import HealthDataEntry from './pages/HealthDataEntry';
import PatientRecords from './pages/PatientRecords';
import MedicationTracker from './pages/MedicationTracker';
import AppointmentScheduler from './pages/AppointmentScheduler';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';
import EmergencyAccess from './components/EmergencyAccess';
import ApiKeyManager from './components/ApiKeyManager';
import NearbyHospitalsPage from './pages/NearbyHospitalsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
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
          <Route 
            path="/nearby-hospitals" 
            element={
              <ProtectedRoute>
                <NearbyHospitalsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
