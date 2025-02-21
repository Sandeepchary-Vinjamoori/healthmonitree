
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">HealthMoniTree</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/health-data">
              <Button variant="ghost">Health Data</Button>
            </Link>
            <Link to="/patient-records">
              <Button variant="ghost">Records</Button>
            </Link>
            <Link to="/medications">
              <Button variant="ghost">Medications</Button>
            </Link>
            <Link to="/appointments">
              <Button>Appointments</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
