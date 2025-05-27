
import React from 'react';
import NavBar from '@/components/NavBar';
import AppointmentScheduler from '@/components/AppointmentScheduler';

const AppointmentSchedulerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20">
        <AppointmentScheduler />
      </div>
    </div>
  );
};

export default AppointmentSchedulerPage;
