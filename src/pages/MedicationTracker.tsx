
import React from 'react';
import NavBar from '@/components/NavBar';
import MedicationTracker from '@/components/MedicationTracker';

const MedicationTrackerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20">
        <MedicationTracker />
      </div>
    </div>
  );
};

export default MedicationTrackerPage;
