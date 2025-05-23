
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import HealthDataForm from '@/components/HealthDataForm';
import HealthDashboard from '@/components/HealthDashboard';
import { useAuth } from '@/contexts/AuthContext';

const HealthDataEntry = () => {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <NavBar />
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">Health Data Dashboard</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Welcome, {user.email}! Track and monitor your health data below.
            </p>
          )}
        </div>
        
        {!submittedData ? (
          <HealthDataForm onSubmit={setSubmittedData} />
        ) : (
          <HealthDashboard patientData={submittedData} />
        )}
      </div>
    </div>
  );
};

export default HealthDataEntry;
