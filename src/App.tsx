
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
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
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <NavBar />
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health-data" 
            element={
              <ProtectedRoute>
                <NavBar />
                <HealthDataEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient-records" 
            element={
              <ProtectedRoute>
                <NavBar />
                <PatientRecords />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medications" 
            element={
              <ProtectedRoute>
                <NavBar />
                <MedicationTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <NavBar />
                <AppointmentScheduler />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nearby-hospitals" 
            element={
              <ProtectedRoute>
                <NavBar />
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
